import asyncio
import json
import os
import time
import uuid
from pathlib import Path

from fastapi import (
    FastAPI,
    WebSocket,
    WebSocketDisconnect,
)

from fastapi.responses import (
    FileResponse,
)

from fastapi.staticfiles import (
    StaticFiles,
)

from groq import Groq

from backend.database import (
    ensure_player,
    get_player,
    get_top_players,
    init_db,
    record_game,
)


# ==================================================
# PATHS
# ==================================================

BASE_DIR = (
    Path(__file__)
    .resolve()
    .parent
    .parent
)

FRONTEND_DIR = (
    BASE_DIR
    /
    "frontend"
)

DATA_DIR = (
    BASE_DIR
    /
    "data"
)

QUESTIONS_PATH = (
    DATA_DIR
    /
    "questions.json"
)

CULTURES_PATH = (
    DATA_DIR
    /
    "cultures.json"
)


# ==================================================
# APP
# ==================================================

app = FastAPI()

init_db()


app.mount(

    "/static",

    StaticFiles(
        directory=
            FRONTEND_DIR
    ),

    name=
        "static",
)


# ==================================================
# GROQ
# ==================================================

GROQ_API_KEY = (
    os.getenv(
        "GROQ_API_KEY"
    )
)


ai_client = (

    Groq(
        api_key=
            GROQ_API_KEY
    )

    if GROQ_API_KEY

    else None
)


# ==================================================
# GAME STATE
# ==================================================

# Easy players only match Easy players.
# Normal players only match Normal players.

waiting_players = {

    "normal":
        None,

    "easy":
        None,
}


games = {}


afk_tasks = {}


AFK_TIMEOUT_SECONDS = (
    60
)


# ==================================================
# DATA
# ==================================================

def load_questions():

    with open(

        QUESTIONS_PATH,

        "r",

        encoding=
            "utf-8",

    ) as file:

        return json.load(
            file
        )



def load_cultures():

    with open(

        CULTURES_PATH,

        "r",

        encoding=
            "utf-8",

    ) as file:

        return json.load(
            file
        )


# ==================================================
# HTTP
# ==================================================

@app.get("/")
async def home():

    return FileResponse(

        FRONTEND_DIR
        /
        "index.html",

        headers={

            "Cache-Control":
                (
                    "no-store, "
                    "no-cache, "
                    "must-revalidate, "
                    "max-age=0"
                )
        },
    )



@app.get(
    "/api/questions"
)
async def api_questions():

    return load_questions()



@app.get(
    "/api/cultures"
)
async def api_cultures():

    return load_cultures()



@app.get(
    "/api/leaderboard"
)
async def api_leaderboard():

    return get_top_players(
        10
    )



@app.get(
    "/api/player/{username}"
)
async def api_player(
    username: str,
):

    player = get_player(
        username
    )


    if player:

        return player


    return {

        "username":
            username,

        "trophies":
            0,
    }


# ==================================================
# GAME HELPERS
# ==================================================

def get_game_player(
    game,
    player_id,
):

    return next(

        (

            player

            for player
            in game[
                "players"
            ]

            if player[
                "id"
            ]
            ==
            player_id
        ),

        None,
    )



def get_other_player(
    game,
    player_id,
):

    return next(

        (

            player

            for player
            in game[
                "players"
            ]

            if player[
                "id"
            ]
            !=
            player_id
        ),

        None,
    )



async def safe_send(
    player,
    payload,
):

    try:

        await player[
            "websocket"
        ].send_json(
            payload
        )


        return True


    except Exception:

        return False



async def broadcast_game(
    game,
    payload,
):

    for player in game[
        "players"
    ]:

        await safe_send(

            player,

            payload,
        )


# ==================================================
# AI REFEREE
# ==================================================

def validate_answer_with_ai(
    culture,
    question,
    answer,
):

    if (
        ai_client
        is
        None
    ):

        return {

            "decision":
                "UNCERTAIN",

            "reason":
                "AI referee is unavailable.",
        }


    prompt = f"""
Culture being represented: {culture}

Question:
{question}

Player answer:
{answer}


Decide whether the answer should be accepted in CultureGuessr.

Rules:

1. ACCEPT answers that are accurate, reasonable,
subjective, personal, approximate, or culturally variable.

2. REJECT only when the answer is clearly factually false,
strongly incompatible with the selected culture,
or deliberately misleading.

3. Do not reject an answer merely because it does not
match a stereotype.

4. If the answer cannot be confidently verified,
use UNCERTAIN.

5. Keep the reason short.


Examples:

American / What side of the road do you drive on? / Left
=> REJECT

American / What side of the road do you drive on? / Right
=> ACCEPT

Australian / What's a normal breakfast for you? / Cereal
=> ACCEPT


Return ONLY:

{{
    "decision": "ACCEPT",
    "reason": "Short reason"
}}
"""


    try:

        response = (

            ai_client
            .chat
            .completions
            .create(

                model=
                    "qwen/qwen3.6-27b",

                messages=[

                    {

                        "role":
                            "system",

                        "content":
                            (
                                "You are a conservative "
                                "cultural accuracy referee "
                                "for CultureGuessr. "
                                "Return only valid JSON. "
                                "Reject only clearly false "
                                "or deliberately misleading "
                                "answers."
                            ),
                    },


                    {

                        "role":
                            "user",

                        "content":
                            prompt,
                    },
                ],

                reasoning_effort=
                    "none",

                temperature=
                    0.2,

                max_completion_tokens=
                    300,

                response_format={

                    "type":
                        "json_object"
                },
            )
        )


        raw_output = (

            response
            .choices[0]
            .message
            .content
            .strip()
        )


        result = json.loads(
            raw_output
        )


        decision = (

            str(

                result.get(

                    "decision",

                    "UNCERTAIN",
                )
            )

            .strip()

            .upper()
        )


        reason = (

            str(

                result.get(

                    "reason",

                    "No reason provided.",
                )
            )

            .strip()
        )


        if decision not in {

            "ACCEPT",
            "REJECT",
            "UNCERTAIN",

        }:

            decision = (
                "UNCERTAIN"
            )


        return {

            "decision":
                decision,

            "reason":
                reason,
        }


    except Exception as error:

        print(
            "GROQ AI ERROR:",
            error,
        )


        return {

            "decision":
                "UNCERTAIN",

            "reason":
                "AI referee could not verify the answer.",
        }


# ==================================================
# FINISH GAME
# ==================================================

async def finish_game(
    game,
    winner,
    loser,
    reason="normal",
    afk_player_name=None,
):

    if (
        game.get(
            "phase"
        )
        ==
        "game_over"
    ):

        return


    game[
        "phase"
    ] = "game_over"


    game[
        "winner"
    ] = winner[
        "id"
    ]


    trophies = record_game(

        winner[
            "name"
        ],

        loser[
            "name"
        ],
    )


    payload = {

        "type":
            "game_over",

        "winner_id":
            winner[
                "id"
            ],

        "winner_name":
            winner[
                "name"
            ],

        "reason":
            reason,

        "players": [

            {

                "id":
                    player[
                        "id"
                    ],

                "name":
                    player[
                        "name"
                    ],

                "culture":
                    player[
                        "culture"
                    ],
            }

            for player
            in game[
                "players"
            ]
        ],

        "trophies":
            trophies,
    }


    if (
        afk_player_name
    ):

        payload[
            "afk_player_name"
        ] = afk_player_name


    await broadcast_game(

        game,

        payload,
    )


# ==================================================
# AFK
# ==================================================

def get_expected_player(
    game,
):

    phase = game.get(
        "phase"
    )


    if (
        phase
        ==
        "choosing"
    ):

        return get_game_player(

            game,

            game.get(
                "turn"
            ),
        )


    if (
        phase
        ==
        "answering"
    ):

        return get_other_player(

            game,

            game.get(
                "asker_id"
            ),
        )


    # checking = pause timer

    return None



async def finish_afk_game(
    game,
    inactive_player,
):

    if (
        game.get(
            "phase"
        )
        ==
        "game_over"
    ):

        return


    winner = get_other_player(

        game,

        inactive_player[
            "id"
        ],
    )


    if (
        winner
        is
        None
    ):

        return


    await finish_game(

        game,

        winner,

        inactive_player,

        reason=
            "afk",

        afk_player_name=
            inactive_player[
                "name"
            ],
    )



async def watch_for_afk(
    game_id,
):

    try:

        while True:

            await asyncio.sleep(
                1
            )


            game = games.get(
                game_id
            )


            if (
                game
                is
                None
            ):

                return


            if (
                game.get(
                    "phase"
                )
                ==
                "game_over"
            ):

                return


            expected_player = (
                get_expected_player(
                    game
                )
            )


            if (
                expected_player
                is
                None
            ):

                continue


            started = game.get(
                "action_started_at"
            )


            if (
                started
                is
                None
            ):

                continue


            if (
                time.monotonic()
                -
                started
                >=
                AFK_TIMEOUT_SECONDS
            ):

                await finish_afk_game(

                    game,

                    expected_player,
                )


                return


    finally:

        afk_tasks.pop(

            game_id,

            None,
        )


# ==================================================
# CREATE GAME
# ==================================================

async def create_game(
    player_one,
    player_two,
    mode,
):

    game_id = (

        uuid.uuid4()
        .hex[:8]
    )


    game = {

        "id":
            game_id,

        "mode":
            mode,

        "players": [

            player_one,
            player_two,
        ],

        "turn":
            player_one[
                "id"
            ],

        "round":
            1,

        "phase":
            "choosing",

        "current_question":
            None,

        "current_category":
            None,

        "asker_id":
            None,

        "winner":
            None,

        "action_started_at":
            time.monotonic(),
    }


    player_one[
        "game_id"
    ] = game_id


    player_two[
        "game_id"
    ] = game_id


    games[
        game_id
    ] = game


    await safe_send(

        player_one,

        {

            "type":
                "matched",

            "game_id":
                game_id,

            "mode":
                mode,

            "you": {

                "id":
                    player_one[
                        "id"
                    ],

                "name":
                    player_one[
                        "name"
                    ],
            },

            "opponent": {

                "id":
                    player_two[
                        "id"
                    ],

                "name":
                    player_two[
                        "name"
                    ],
            },

            "guesses_remaining":
                player_one[
                    "guesses"
                ],

            "round":
                game[
                    "round"
                ],

            "your_turn":
                True,
        },
    )


    await safe_send(

        player_two,

        {

            "type":
                "matched",

            "game_id":
                game_id,

            "mode":
                mode,

            "you": {

                "id":
                    player_two[
                        "id"
                    ],

                "name":
                    player_two[
                        "name"
                    ],
            },

            "opponent": {

                "id":
                    player_one[
                        "id"
                    ],

                "name":
                    player_one[
                        "name"
                    ],
            },

            "guesses_remaining":
                player_two[
                    "guesses"
                ],

            "round":
                game[
                    "round"
                ],

            "your_turn":
                False,
        },
    )


    afk_tasks[
        game_id
    ] = asyncio.create_task(

        watch_for_afk(
            game_id
        )
    )


# ==================================================
# ASK QUESTION
# ==================================================

async def handle_ask_question(
    player,
    data,
):

    game = games.get(

        player.get(
            "game_id"
        )
    )


    if (
        game
        is
        None
    ):

        return


    if (
        game.get(
            "phase"
        )
        !=
        "choosing"
    ):

        return


    if (
        game.get(
            "turn"
        )
        !=
        player[
            "id"
        ]
    ):

        await safe_send(

            player,

            {

                "type":
                    "error",

                "message":
                    "It is not your turn.",
            },
        )


        return


    category = (

        str(

            data.get(

                "category",

                "",
            )
        )

        .strip()
    )


    question = (

        str(

            data.get(

                "question",

                "",
            )
        )

        .strip()
    )


    questions = (
        load_questions()
    )


    if (
        category
        not in
        questions

        or

        question
        not in
        questions[
            category
        ]
    ):

        await safe_send(

            player,

            {

                "type":
                    "error",

                "message":
                    "That question is not valid.",
            },
        )


        return


    game[
        "current_category"
    ] = category


    game[
        "current_question"
    ] = question


    game[
        "asker_id"
    ] = player[
        "id"
    ]


    game[
        "phase"
    ] = "answering"


    game[
        "action_started_at"
    ] = time.monotonic()


    await broadcast_game(

        game,

        {

            "type":
                "question_asked",

            "asker_id":
                player[
                    "id"
                ],

            "category":
                category,

            "question":
                question,
        },
    )


# ==================================================
# ANSWER
# ==================================================

async def handle_answer_question(
    player,
    data,
):

    game = games.get(

        player.get(
            "game_id"
        )
    )


    if (
        game
        is
        None
    ):

        return


    if (
        game.get(
            "phase"
        )
        !=
        "answering"
    ):

        return


    expected_player = (
        get_expected_player(
            game
        )
    )


    if (
        expected_player
        is
        None

        or

        expected_player[
            "id"
        ]
        !=
        player[
            "id"
        ]
    ):

        await safe_send(

            player,

            {

                "type":
                    "error",

                "message":
                    (
                        "You are not the player "
                        "who needs to answer."
                    ),
            },
        )


        return


    answer = (

        str(

            data.get(

                "answer",

                "",
            )
        )

        .strip()
    )


    if (
        not answer
    ):

        return


    await safe_send(

        player,

        {

            "type":
                "answer_checking",
        },
    )


    game[
        "phase"
    ] = "checking"


    validation = (

        await asyncio.to_thread(

            validate_answer_with_ai,

            player[
                "culture"
            ],

            game[
                "current_question"
            ],

            answer,
        )
    )


    current_game = games.get(

        game[
            "id"
        ]
    )


    if (
        current_game
        is
        None
    ):

        return


    if (
        current_game.get(
            "phase"
        )
        ==
        "game_over"
    ):

        return


    decision = validation[
        "decision"
    ]


    reason = validation[
        "reason"
    ]


    print()

    print(
        "=" * 30
    )

    print(
        "CULTUREGUESSR AI REFEREE"
    )

    print(
        "Culture:",
        player[
            "culture"
        ],
    )

    print(
        "Question:",
        game[
            "current_question"
        ],
    )

    print(
        "Answer:",
        answer,
    )

    print(
        "Decision:",
        decision,
    )

    print(
        "Reason:",
        reason,
    )

    print(
        "=" * 30
    )


    if (
        decision
        ==
        "REJECT"
    ):

        game[
            "phase"
        ] = "answering"


        game[
            "action_started_at"
        ] = time.monotonic()


        await safe_send(

            player,

            {

                "type":
                    "answer_rejected",

                "reason":
                    reason,
            },
        )


        return


    answerer_id = (
        player[
            "id"
        ]
    )


    game[
        "turn"
    ] = answerer_id


    game[
        "round"
    ] += 1


    game[
        "phase"
    ] = "choosing"


    game[
        "action_started_at"
    ] = time.monotonic()


    await broadcast_game(

        game,

        {

            "type":
                "answer_received",

            "answerer_id":
                answerer_id,

            "category":
                game[
                    "current_category"
                ],

            "question":
                game[
                    "current_question"
                ],

            "answer":
                answer,

            "decision":
                decision,

            "next_turn":
                answerer_id,

            "round":
                game[
                    "round"
                ],
        },
    )


# ==================================================
# GUESS
# ==================================================

async def handle_make_guess(
    player,
    data,
):

    game = games.get(

        player.get(
            "game_id"
        )
    )


    if (
        game
        is
        None
    ):

        return


    if (
        game.get(
            "phase"
        )
        !=
        "choosing"
    ):

        return


    if (
        game.get(
            "turn"
        )
        !=
        player[
            "id"
        ]
    ):

        await safe_send(

            player,

            {

                "type":
                    "error",

                "message":
                    "It is not your turn.",
            },
        )


        return


    guess = (

        str(

            data.get(

                "guess",

                "",
            )
        )

        .strip()
    )


    if (
        not guess
    ):

        return


    opponent = get_other_player(

        game,

        player[
            "id"
        ],
    )


    if (
        opponent
        is
        None
    ):

        return


    correct = (

        guess.casefold()
        ==
        opponent[
            "culture"
        ].casefold()
    )


    if (
        correct
    ):

        await finish_game(

            game,

            player,

            opponent,

            reason=
                "correct_guess",
        )


        return


    player[
        "guesses"
    ] -= 1


    if (
        player[
            "guesses"
        ]
        <=
        0
    ):

        player[
            "guesses"
        ] = 0


        await finish_game(

            game,

            opponent,

            player,

            reason=
                "no_guesses",
        )


        return


    game[
        "turn"
    ] = opponent[
        "id"
    ]


    game[
        "phase"
    ] = "choosing"


    # 5 second wrong-guess message,
    # then full 60 second AFK allowance.

    game[
        "action_started_at"
    ] = (

        time.monotonic()
        +
        5
    )


    await broadcast_game(

        game,

        {

            "type":
                "guess_result",

            "player_id":
                player[
                    "id"
                ],

            "guesses_remaining":
                player[
                    "guesses"
                ],

            "next_turn":
                opponent[
                    "id"
                ],
        },
    )


# ==================================================
# WEBSOCKET
# ==================================================

@app.websocket(
    "/ws"
)
async def websocket_endpoint(
    websocket: WebSocket,
):

    global waiting_players


    await websocket.accept()


    player = {

        "id":
            uuid.uuid4()
            .hex[:8],

        "name":
            None,

        "culture":
            None,

        "mode":
            "normal",

        "websocket":
            websocket,

        "game_id":
            None,

        "guesses":
            3,
    }


    try:

        while True:

            data = (

                await websocket
                .receive_json()
            )


            message_type = (
                data.get(
                    "type"
                )
            )


            # ======================================
            # JOIN
            # ======================================

            if (
                message_type
                ==
                "join"
            ):

                name = (

                    str(

                        data.get(

                            "name",

                            "",
                        )
                    )

                    .strip()
                )


                culture = (

                    str(

                        data.get(

                            "culture",

                            "",
                        )
                    )

                    .strip()
                )


                mode = (

                    str(

                        data.get(

                            "mode",

                            "normal",
                        )
                    )

                    .strip()

                    .lower()
                )


                if mode not in {

                    "normal",
                    "easy",

                }:

                    mode = (
                        "normal"
                    )


                if (
                    not name
                    or
                    not culture
                ):

                    await safe_send(

                        player,

                        {

                            "type":
                                "error",

                            "message":
                                (
                                    "Name and culture "
                                    "are required."
                                ),
                        },
                    )


                    continue


                cultures = (
                    load_cultures()
                )


                if (
                    culture
                    not in
                    cultures
                ):

                    await safe_send(

                        player,

                        {

                            "type":
                                "error",

                            "message":
                                (
                                    "That culture "
                                    "is not available."
                                ),
                        },
                    )


                    continue


                player[
                    "name"
                ] = name


                player[
                    "culture"
                ] = culture


                player[
                    "mode"
                ] = mode


                ensure_player(
                    name
                )


                waiting_player = (

                    waiting_players[
                        mode
                    ]
                )


                if (
                    waiting_player
                    is
                    None
                ):

                    waiting_players[
                        mode
                    ] = player


                    await safe_send(

                        player,

                        {

                            "type":
                                "waiting",

                            "mode":
                                mode,
                        },
                    )


                else:

                    opponent = (
                        waiting_player
                    )


                    waiting_players[
                        mode
                    ] = None


                    await create_game(

                        opponent,

                        player,

                        mode,
                    )


            # ======================================
            # ASK
            # ======================================

            elif (
                message_type
                ==
                "ask_question"
            ):

                await handle_ask_question(

                    player,

                    data,
                )


            # ======================================
            # ANSWER
            # ======================================

            elif (
                message_type
                ==
                "answer_question"
            ):

                await handle_answer_question(

                    player,

                    data,
                )


            # ======================================
            # GUESS
            # ======================================

            elif (
                message_type
                ==
                "make_guess"
            ):

                await handle_make_guess(

                    player,

                    data,
                )


    except WebSocketDisconnect:

        pass


    except Exception as error:

        print(
            "WEBSOCKET ERROR:",
            error,
        )


    finally:

        # Remove disconnected player
        # from either waiting queue.

        for mode_name in (

            "normal",
            "easy",

        ):

            if (
                waiting_players[
                    mode_name
                ]
                is
                player
            ):

                waiting_players[
                    mode_name
                ] = None


        game_id = (
            player.get(
                "game_id"
            )
        )


        if (
            game_id
        ):

            game = games.get(
                game_id
            )


            if (
                game
                is not
                None

                and

                game.get(
                    "phase"
                )
                !=
                "game_over"
            ):

                opponent = get_other_player(

                    game,

                    player[
                        "id"
                    ],
                )


                if (
                    opponent
                ):

                    await safe_send(

                        opponent,

                        {

                            "type":
                                "opponent_left",
                        },
                    )


            task = afk_tasks.pop(

                game_id,

                None,
            )


            if (
                task
                is not
                None

                and

                not task.done()
            ):

                task.cancel()


            games.pop(

                game_id,

                None,
            )