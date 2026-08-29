import sqlite3
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent.parent
DATABASE_PATH = BASE_DIR / "data" / "cultureguessr.db"

DATABASE_PATH.parent.mkdir(parents=True, exist_ok=True)


def get_connection():
    connection = sqlite3.connect(DATABASE_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def init_db():
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS players (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE COLLATE NOCASE NOT NULL,
            trophies INTEGER NOT NULL DEFAULT 0
        )
        """
    )

    connection.commit()
    connection.close()


def ensure_player(username):
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        INSERT OR IGNORE INTO players (username, trophies)
        VALUES (?, 0)
        """,
        (username,)
    )

    connection.commit()
    connection.close()


def get_player(username):
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT username, trophies
        FROM players
        WHERE username = ?
        """,
        (username,)
    )

    row = cursor.fetchone()

    connection.close()

    if row is None:
        return None

    return dict(row)


def record_game(winner, loser):
    connection = get_connection()
    cursor = connection.cursor()

    # Winner gets +1 trophy
    cursor.execute(
        """
        UPDATE players
        SET trophies = trophies + 1
        WHERE username = ?
        """,
        (winner,)
    )

    # Loser gets -1, but cannot go below 0
    cursor.execute(
        """
        UPDATE players
        SET trophies =
            CASE
                WHEN trophies > 0 THEN trophies - 1
                ELSE 0
            END
        WHERE username = ?
        """,
        (loser,)
    )

    connection.commit()

    cursor.execute(
        """
        SELECT trophies
        FROM players
        WHERE username = ?
        """,
        (winner,)
    )

    winner_row = cursor.fetchone()
    winner_trophies = winner_row["trophies"]

    cursor.execute(
        """
        SELECT trophies
        FROM players
        WHERE username = ?
        """,
        (loser,)
    )

    loser_row = cursor.fetchone()
    loser_trophies = loser_row["trophies"]

    connection.close()

    return {
        winner: winner_trophies,
        loser: loser_trophies
    }


def get_top_players(limit=10):
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT username, trophies
        FROM players
        ORDER BY trophies DESC, username ASC
        LIMIT ?
        """,
        (limit,)
    )

    players = [
        dict(row)
        for row in cursor.fetchall()
    ]

    connection.close()

    return players