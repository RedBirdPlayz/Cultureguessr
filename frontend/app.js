console.log("CultureGuessr frontend: map-v6");

// ==================================================
// DOM
// ==================================================

const flagBackground =
    document.getElementById("flag-background");

const stickyNotesLayer =
    document.getElementById("sticky-notes-layer");

const easyMapPanel =
    document.getElementById("easy-map-panel");

const easyWorldMap =
    document.getElementById("easy-world-map");

const resetMapButton =
    document.getElementById("reset-map");

const toggleMapSizeButton =
    document.getElementById("toggle-map-size");

const eliminatedCount =
    document.getElementById("eliminated-count");

const normalModeButton =
    document.getElementById("normal-mode-button");

const easyModeButton =
    document.getElementById("easy-mode-button");

const gameModeValue =
    document.getElementById("game-mode-value");

const selectedModeDescription =
    document.getElementById("selected-mode-description");

const currentModeDisplay =
    document.getElementById("current-mode");

const joinForm =
    document.getElementById("join-form");

const joinScreen =
    document.getElementById("join-screen");

const statusScreen =
    document.getElementById("status-screen");

const statusTitle =
    document.getElementById("status-title");

const statusText =
    document.getElementById("status-text");

const leaderboardSection =
    document.getElementById("leaderboard-section");

const errorMessage =
    document.getElementById("error-message");

const playerNameInput =
    document.getElementById("player-name");

const playerProfilePreview =
    document.getElementById("player-profile-preview");

const playerTrophyCount =
    document.getElementById("player-trophy-count");

const gameScreen =
    document.getElementById("game-screen");

const currentGameId =
    document.getElementById("current-game-id");

const currentOpponent =
    document.getElementById("current-opponent");

const roundNumber =
    document.getElementById("round-number");

const gameStatus =
    document.getElementById("game-status");

const turnControls =
    document.getElementById("turn-controls");

const guessesRemainingDisplay =
    document.getElementById("guesses-remaining-display");

const categorySelect =
    document.getElementById("category-select");

const showQuestionsButton =
    document.getElementById("show-questions");

const questionOptions =
    document.getElementById("question-options");

const answerPanel =
    document.getElementById("answer-panel");

const incomingQuestion =
    document.getElementById("incoming-question");

const answerInput =
    document.getElementById("answer-input");

const sendAnswerButton =
    document.getElementById("send-answer");

const openGuessButton =
    document.getElementById("open-guess");

const guessPanel =
    document.getElementById("guess-panel");

const cultureGuessInput =
    document.getElementById("culture-guess-input");

const submitGuessButton =
    document.getElementById("submit-guess");

const cancelGuessButton =
    document.getElementById("cancel-guess");

const guessCount =
    document.getElementById("guess-count");

const gameOverPanel =
    document.getElementById("game-over-panel");

const gameOverTitle =
    document.getElementById("game-over-title");

const gameOverMessage =
    document.getElementById("game-over-message");

const leaderboardList =
    document.getElementById("leaderboard-list");


// ==================================================
// STATE
// ==================================================

let socket = null;

let questionBank = {};

let cultureList = [];

let myId = null;
let opponentId = null;

let myName = "";
let opponentName = "";

let guessesRemaining = 3;
let currentRound = 1;

let questionsLocked = false;
let questionSubmitted = false;

let stickyNoteCount = 0;
let highestStickyZ = 10;

let selectedGameMode = "normal";
let currentGameMode = "normal";

let worldMapLoaded = false;
let mapExpanded = false;

const eliminatedCountryIds =
    new Set();


// ==================================================
// FLAG DATA
// ==================================================

const cultureFlagCodes = {
    "Afghan": "af",
    "Albanian": "al",
    "Algerian": "dz",
    "American": "us",
    "Argentinian": "ar",
    "Armenian": "am",
    "Australian": "au",
    "Austrian": "at",
    "Azerbaijani": "az",
    "Bangladeshi": "bd",
    "Belgian": "be",
    "Bolivian": "bo",
    "Bosnian": "ba",
    "Brazilian": "br",
    "British": "gb",
    "Bulgarian": "bg",
    "Cambodian": "kh",
    "Cameroonian": "cm",
    "Canadian": "ca",
    "Chilean": "cl",
    "Chinese": "cn",
    "Colombian": "co",
    "Congolese": "cd",
    "Croatian": "hr",
    "Cuban": "cu",
    "Cypriot": "cy",
    "Czech": "cz",
    "Danish": "dk",
    "Dominican": "do",
    "Dutch": "nl",
    "Ecuadorian": "ec",
    "Egyptian": "eg",
    "Emirati": "ae",
    "Ethiopian": "et",
    "Filipino": "ph",
    "Finnish": "fi",
    "French": "fr",
    "Georgian": "ge",
    "German": "de",
    "Ghanaian": "gh",
    "Greek": "gr",
    "Guatemalan": "gt",
    "Haitian": "ht",
    "Hong Konger": "hk",
    "Hungarian": "hu",
    "Icelandic": "is",
    "Indian": "in",
    "Indonesian": "id",
    "Iranian": "ir",
    "Iraqi": "iq",
    "Irish": "ie",
    "Italian": "it",
    "Jamaican": "jm",
    "Japanese": "jp",
    "Jordanian": "jo",
    "Kazakh": "kz",
    "Kenyan": "ke",
    "Korean": "kr",
    "Kuwaiti": "kw",
    "Kyrgyz": "kg",
    "Laotian": "la",
    "Latvian": "lv",
    "Lebanese": "lb",
    "Libyan": "ly",
    "Lithuanian": "lt",
    "Malaysian": "my",
    "Maltese": "mt",
    "Mauritian": "mu",
    "Mexican": "mx",
    "Mongolian": "mn",
    "Moroccan": "ma",
    "Myanmar": "mm",
    "Nepali": "np",
    "New Zealand": "nz",
    "Nigerian": "ng",
    "Norwegian": "no",
    "Omani": "om",
    "Pakistani": "pk",
    "Palestinian": "ps",
    "Panamanian": "pa",
    "Paraguayan": "py",
    "Peruvian": "pe",
    "Polish": "pl",
    "Portuguese": "pt",
    "Puerto Rican": "pr",
    "Qatari": "qa",
    "Romanian": "ro",
    "Russian": "ru",
    "Saudi Arabian": "sa",
    "Serbian": "rs",
    "Singaporean": "sg",
    "Slovak": "sk",
    "Slovenian": "si",
    "Somali": "so",
    "South African": "za",
    "Spanish": "es",
    "Sri Lankan": "lk",
    "Sudanese": "sd",
    "Swedish": "se",
    "Swiss": "ch",
    "Syrian": "sy",
    "Taiwanese": "tw",
    "Tajik": "tj",
    "Thai": "th",
    "Tunisian": "tn",
    "Turkish": "tr",
    "Ukrainian": "ua",
    "Uruguayan": "uy",
    "Uzbek": "uz",
    "Venezuelan": "ve",
    "Vietnamese": "vn",
    "Yemeni": "ye",
    "Zimbabwean": "zw"
};

const specialFlagUrls = {
    "Scottish":
        "https://flagcdn.com/gb-sct.svg",

    "Welsh":
        "https://flagcdn.com/gb-wls.svg"
};


// ==================================================
// HELPERS
// ==================================================

function escapeHtml(text) {

    const div =
        document.createElement("div");

    div.textContent =
        String(text);

    return div.innerHTML;
}


function formatCategory(category) {

    return String(category)
        .replaceAll("_", " ")
        .replace(
            /\b\w/g,
            letter =>
                letter.toUpperCase()
        );
}


function shuffleArray(array) {

    const result =
        [...array];

    for (
        let i = result.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() *
                (i + 1)
            );

        [
            result[i],
            result[j]
        ] = [
            result[j],
            result[i]
        ];
    }

    return result;
}


function updateGuessDisplays() {

    guessCount.textContent =
        guessesRemaining;

    guessesRemainingDisplay.textContent =
        guessesRemaining;
}


// ==================================================
// MODE SELECTOR
// ==================================================

function selectGameMode(mode) {

    selectedGameMode =
        mode === "easy"
            ? "easy"
            : "normal";

    gameModeValue.value =
        selectedGameMode;

    const easySelected =
        selectedGameMode === "easy";

    normalModeButton.classList.toggle(
        "selected",
        !easySelected
    );

    easyModeButton.classList.toggle(
        "selected",
        easySelected
    );

    normalModeButton.setAttribute(
        "aria-pressed",
        String(!easySelected)
    );

    easyModeButton.setAttribute(
        "aria-pressed",
        String(easySelected)
    );

    selectedModeDescription.textContent =
        easySelected
            ? "🗺️ Easy Mode selected — elimination map enabled."
            : "🎯 Normal Mode selected";
}


normalModeButton.addEventListener(
    "click",
    () => selectGameMode("normal")
);

easyModeButton.addEventListener(
    "click",
    () => selectGameMode("easy")
);

selectGameMode("normal");



const ISO_NUMERIC_TO_ALPHA3 = {
    "004": "AFG",
    "008": "ALB",
    "010": "ATA",
    "012": "DZA",
    "016": "ASM",
    "020": "AND",
    "024": "AGO",
    "028": "ATG",
    "031": "AZE",
    "032": "ARG",
    "036": "AUS",
    "040": "AUT",
    "044": "BHS",
    "048": "BHR",
    "050": "BGD",
    "051": "ARM",
    "052": "BRB",
    "056": "BEL",
    "060": "BMU",
    "064": "BTN",
    "068": "BOL",
    "070": "BIH",
    "072": "BWA",
    "074": "BVT",
    "076": "BRA",
    "084": "BLZ",
    "086": "IOT",
    "090": "SLB",
    "092": "VGB",
    "096": "BRN",
    "100": "BGR",
    "104": "MMR",
    "108": "BDI",
    "112": "BLR",
    "116": "KHM",
    "120": "CMR",
    "124": "CAN",
    "132": "CPV",
    "136": "CYM",
    "140": "CAF",
    "144": "LKA",
    "148": "TCD",
    "152": "CHL",
    "156": "CHN",
    "158": "TWN",
    "162": "CXR",
    "166": "CCK",
    "170": "COL",
    "174": "COM",
    "175": "MYT",
    "178": "COG",
    "180": "COD",
    "184": "COK",
    "188": "CRI",
    "191": "HRV",
    "192": "CUB",
    "196": "CYP",
    "203": "CZE",
    "204": "BEN",
    "208": "DNK",
    "212": "DMA",
    "214": "DOM",
    "218": "ECU",
    "222": "SLV",
    "226": "GNQ",
    "231": "ETH",
    "232": "ERI",
    "233": "EST",
    "234": "FRO",
    "238": "FLK",
    "239": "SGS",
    "242": "FJI",
    "246": "FIN",
    "248": "ALA",
    "250": "FRA",
    "254": "GUF",
    "258": "PYF",
    "260": "ATF",
    "262": "DJI",
    "266": "GAB",
    "268": "GEO",
    "270": "GMB",
    "275": "PSE",
    "276": "DEU",
    "288": "GHA",
    "292": "GIB",
    "296": "KIR",
    "300": "GRC",
    "304": "GRL",
    "308": "GRD",
    "312": "GLP",
    "316": "GUM",
    "320": "GTM",
    "324": "GIN",
    "328": "GUY",
    "332": "HTI",
    "334": "HMD",
    "336": "VAT",
    "340": "HND",
    "344": "HKG",
    "348": "HUN",
    "352": "ISL",
    "356": "IND",
    "360": "IDN",
    "364": "IRN",
    "368": "IRQ",
    "372": "IRL",
    "376": "ISR",
    "380": "ITA",
    "384": "CIV",
    "388": "JAM",
    "392": "JPN",
    "398": "KAZ",
    "400": "JOR",
    "404": "KEN",
    "408": "PRK",
    "410": "KOR",
    "414": "KWT",
    "417": "KGZ",
    "418": "LAO",
    "422": "LBN",
    "426": "LSO",
    "428": "LVA",
    "430": "LBR",
    "434": "LBY",
    "438": "LIE",
    "440": "LTU",
    "442": "LUX",
    "446": "MAC",
    "450": "MDG",
    "454": "MWI",
    "458": "MYS",
    "462": "MDV",
    "466": "MLI",
    "470": "MLT",
    "474": "MTQ",
    "478": "MRT",
    "480": "MUS",
    "484": "MEX",
    "492": "MCO",
    "496": "MNG",
    "498": "MDA",
    "499": "MNE",
    "500": "MSR",
    "504": "MAR",
    "508": "MOZ",
    "512": "OMN",
    "516": "NAM",
    "520": "NRU",
    "524": "NPL",
    "528": "NLD",
    "531": "CUW",
    "533": "ABW",
    "534": "SXM",
    "535": "BES",
    "540": "NCL",
    "548": "VUT",
    "554": "NZL",
    "558": "NIC",
    "562": "NER",
    "566": "NGA",
    "570": "NIU",
    "574": "NFK",
    "578": "NOR",
    "580": "MNP",
    "581": "UMI",
    "583": "FSM",
    "584": "MHL",
    "585": "PLW",
    "586": "PAK",
    "591": "PAN",
    "598": "PNG",
    "600": "PRY",
    "604": "PER",
    "608": "PHL",
    "612": "PCN",
    "616": "POL",
    "620": "PRT",
    "624": "GNB",
    "626": "TLS",
    "630": "PRI",
    "634": "QAT",
    "638": "REU",
    "642": "ROU",
    "643": "RUS",
    "646": "RWA",
    "652": "BLM",
    "654": "SHN",
    "659": "KNA",
    "660": "AIA",
    "662": "LCA",
    "663": "MAF",
    "666": "SPM",
    "670": "VCT",
    "674": "SMR",
    "678": "STP",
    "682": "SAU",
    "686": "SEN",
    "688": "SRB",
    "690": "SYC",
    "694": "SLE",
    "702": "SGP",
    "703": "SVK",
    "704": "VNM",
    "705": "SVN",
    "706": "SOM",
    "710": "ZAF",
    "716": "ZWE",
    "724": "ESP",
    "728": "SSD",
    "729": "SDN",
    "732": "ESH",
    "740": "SUR",
    "744": "SJM",
    "748": "SWZ",
    "752": "SWE",
    "756": "CHE",
    "760": "SYR",
    "762": "TJK",
    "764": "THA",
    "768": "TGO",
    "772": "TKL",
    "776": "TON",
    "780": "TTO",
    "784": "ARE",
    "788": "TUN",
    "792": "TUR",
    "795": "TKM",
    "796": "TCA",
    "798": "TUV",
    "800": "UGA",
    "804": "UKR",
    "807": "MKD",
    "818": "EGY",
    "826": "GBR",
    "831": "GGY",
    "832": "JEY",
    "833": "IMN",
    "834": "TZA",
    "840": "USA",
    "850": "VIR",
    "854": "BFA",
    "858": "URY",
    "860": "UZB",
    "862": "VEN",
    "876": "WLF",
    "882": "WSM",
    "887": "YEM",
    "894": "ZMB",
};


function getCountryNumericId(country) {

    if (
        !country ||
        country.id === undefined ||
        country.id === null
    ) {

        return "";
    }

    const rawId =
        String(country.id).trim();

    if (
        !rawId ||
        rawId === "undefined" ||
        rawId === "null"
    ) {

        return "";
    }

    return rawId.padStart(3, "0");
}


function getCountryShortCode(country) {

    const numericId =
        getCountryNumericId(country);

    if (!numericId) {
        return "";
    }

    /*
    Never display "undefined" or a raw number on the
    map. If a feature has no known ISO alpha-3 code,
    simply leave that one label blank.
    */
    return (
        ISO_NUMERIC_TO_ALPHA3[numericId]
        ||
        ""
    );
}


function mapLabelBoxesOverlap(
    first,
    second,
    gap = 2
) {

    return !(
        first.right + gap <= second.left ||
        first.left - gap >= second.right ||
        first.bottom + gap <= second.top ||
        first.top - gap >= second.bottom
    );
}


function makeMapLabelBox(
    x,
    y,
    width = 23,
    height = 12
) {

    return {
        left: x - width / 2,
        right: x + width / 2,
        top: y - height / 2,
        bottom: y + height / 2
    };
}


function buildCountryLabelLayout(
    features,
    path,
    canvasWidth,
    canvasHeight
) {

    const placedBoxes = [];
    const finalLabels = [];
    const externalQueue = [];

    const safeEdge = 9;
    const labelWidth = 23;
    const labelHeight = 12;

    const countryInfo =
        features
            .map(country => {

                const code =
                    getCountryShortCode(country);

                if (!code) {
                    return null;
                }

                const centroid =
                    path.centroid(country);

                if (
                    !centroid ||
                    !Number.isFinite(centroid[0]) ||
                    !Number.isFinite(centroid[1])
                ) {
                    return null;
                }

                const bounds =
                    path.bounds(country);

                const bboxWidth =
                    bounds[1][0] - bounds[0][0];

                const bboxHeight =
                    bounds[1][1] - bounds[0][1];

                const projectedArea =
                    path.area(country);

                return {
                    country,
                    code,
                    centroid,
                    bounds,
                    bboxWidth,
                    bboxHeight,
                    projectedArea
                };
            })
            .filter(Boolean)
            .sort(
                (a, b) =>
                    b.projectedArea - a.projectedArea
            );


    /*
    Keep a code inside only when the country is large
    enough AND that code will not collide with another
    label already placed.
    */
    for (const info of countryInfo) {

        const [x, y] =
            info.centroid;

        const box =
            makeMapLabelBox(
                x,
                y,
                labelWidth,
                labelHeight
            );

        const comfortablyFitsInside =
            info.bboxWidth >= 31 &&
            info.bboxHeight >= 15 &&
            info.projectedArea >= 155 &&
            box.left >= info.bounds[0][0] + 1 &&
            box.right <= info.bounds[1][0] - 1 &&
            box.top >= info.bounds[0][1] + 1 &&
            box.bottom <= info.bounds[1][1] - 1;

        const collides =
            placedBoxes.some(
                existing =>
                    mapLabelBoxesOverlap(
                        box,
                        existing,
                        2.5
                    )
            );

        if (
            comfortablyFitsInside &&
            !collides
        ) {

            placedBoxes.push(box);

            finalLabels.push({
                ...info,
                x,
                y,
                external: false,
                anchorX: x,
                anchorY: y
            });
        }

        else {

            externalQueue.push(info);
        }
    }


    /*
    Small/crowded countries get a nearby external code.
    A spiral search finds the closest free position.
    The collision test makes sure labels never overlap.
    */
    const radii = [
        18,
        25,
        34,
        44,
        56,
        70,
        86
    ];

    const angles = [
        0,
        -Math.PI / 4,
        Math.PI / 4,
        -Math.PI / 2,
        Math.PI / 2,
        -3 * Math.PI / 4,
        3 * Math.PI / 4,
        Math.PI
    ];

    for (const info of externalQueue) {

        const [anchorX, anchorY] =
            info.centroid;

        let chosen = null;

        for (const radius of radii) {

            if (chosen) {
                break;
            }

            for (const angle of angles) {

                const x =
                    anchorX +
                    Math.cos(angle) * radius;

                const y =
                    anchorY +
                    Math.sin(angle) * radius;

                const box =
                    makeMapLabelBox(
                        x,
                        y,
                        labelWidth,
                        labelHeight
                    );

                const insideCanvas =
                    box.left >= safeEdge &&
                    box.right <= canvasWidth - safeEdge &&
                    box.top >= safeEdge &&
                    box.bottom <= canvasHeight - safeEdge;

                if (!insideCanvas) {
                    continue;
                }

                /*
                For tiny countries keep the label outside
                the country's bounding box so the country
                itself remains visible.
                */
                const countryBox = {
                    left: info.bounds[0][0] - 2,
                    right: info.bounds[1][0] + 2,
                    top: info.bounds[0][1] - 2,
                    bottom: info.bounds[1][1] + 2
                };

                if (
                    mapLabelBoxesOverlap(
                        box,
                        countryBox,
                        0
                    )
                ) {
                    continue;
                }

                const collides =
                    placedBoxes.some(
                        existing =>
                            mapLabelBoxesOverlap(
                                box,
                                existing,
                                2.5
                            )
                    );

                if (!collides) {

                    chosen = {
                        x,
                        y,
                        box
                    };

                    break;
                }
            }
        }


        /*
        Rare fallback for extremely crowded clusters:
        use the nearest free slot on the left or right
        edge of the map. This still guarantees labels do
        not overlap each other.
        */
        if (!chosen) {

            const useLeft =
                anchorX < canvasWidth / 2;

            const x =
                useLeft
                    ? 20
                    : canvasWidth - 20;

            const preferredY =
                Math.max(
                    safeEdge + labelHeight,
                    Math.min(
                        canvasHeight - safeEdge - labelHeight,
                        anchorY
                    )
                );

            const step = 13;
            const maxSteps =
                Math.ceil(
                    canvasHeight / step
                );

            for (
                let i = 0;
                i <= maxSteps;
                i++
            ) {

                const offsets =
                    i === 0
                        ? [0]
                        : [i * step, -i * step];

                for (const offset of offsets) {

                    const y =
                        preferredY + offset;

                    const box =
                        makeMapLabelBox(
                            x,
                            y,
                            labelWidth,
                            labelHeight
                        );

                    const insideCanvas =
                        box.left >= safeEdge &&
                        box.right <= canvasWidth - safeEdge &&
                        box.top >= safeEdge &&
                        box.bottom <= canvasHeight - safeEdge;

                    if (!insideCanvas) {
                        continue;
                    }

                    const collides =
                        placedBoxes.some(
                            existing =>
                                mapLabelBoxesOverlap(
                                    box,
                                    existing,
                                    2.5
                                )
                        );

                    if (!collides) {

                        chosen = {
                            x,
                            y,
                            box
                        };

                        break;
                    }
                }

                if (chosen) {
                    break;
                }
            }
        }


        if (chosen) {

            placedBoxes.push(
                chosen.box
            );

            finalLabels.push({
                ...info,
                x: chosen.x,
                y: chosen.y,
                external: true,
                anchorX,
                anchorY
            });
        }
    }


    return finalLabels;
}


// ==================================================
// EASY MODE MAP
// ==================================================

function updateEliminatedCount() {

    eliminatedCount.textContent =
        eliminatedCountryIds.size;
}


function resetEasyMap() {

    eliminatedCountryIds.clear();

    easyWorldMap
        .querySelectorAll(".map-country")
        .forEach(
            country => {

                country.classList.remove(
                    "eliminated"
                );

                country.setAttribute(
                    "aria-pressed",
                    "false"
                );
            }
        );

    updateEliminatedCount();
}


resetMapButton.addEventListener(
    "click",
    resetEasyMap
);


function setMapExpanded(expanded) {

    mapExpanded = Boolean(expanded);

    easyMapPanel.classList.toggle(
        "expanded",
        mapExpanded
    );

    document.body.classList.toggle(
        "map-focus-mode",
        mapExpanded
    );

    toggleMapSizeButton.setAttribute(
        "aria-expanded",
        String(mapExpanded)
    );

    toggleMapSizeButton.textContent =
        mapExpanded
            ? "↙ Shrink"
            : "⛶ Enlarge";

    toggleMapSizeButton.title =
        mapExpanded
            ? "Return map to normal size"
            : "Enlarge map";

    /*
    While the map is enlarged, clues are intentionally
    hidden so neither the map nor the notes obscure each
    other. When the map shrinks, all notes are re-positioned
    into safe space around the centre card and map.
    */
    stickyNotesLayer.classList.toggle(
        "map-expanded-hidden",
        mapExpanded
    );

    if (!mapExpanded) {
        window.setTimeout(
            reflowStickyNotes,
            230
        );
    }
}


toggleMapSizeButton.addEventListener(
    "click",
    function() {
        setMapExpanded(!mapExpanded);
    }
);


function setGameModeUI(mode) {

    currentGameMode =
        mode === "easy"
            ? "easy"
            : "normal";

    currentModeDisplay.textContent =
        currentGameMode === "easy"
            ? "Easy"
            : "Normal";

    if (
        currentGameMode === "easy"
    ) {

        setMapExpanded(false);

        easyMapPanel.hidden =
            false;

        loadEasyWorldMap();
    }

    else {

        setMapExpanded(false);

        easyMapPanel.hidden =
            true;
    }
}


async function loadEasyWorldMap() {

    if (worldMapLoaded) {
        return;
    }

    if (
        !window.d3 ||
        !window.topojson
    ) {

        easyWorldMap.innerHTML = `
            <p class="map-error">
                Could not load the map library.
            </p>
        `;

        return;
    }

    try {

        const response =
            await fetch(
                "https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-50m.json",
                {
                    cache: "no-store"
                }
            );

        if (!response.ok) {

            throw new Error(
                "World map download failed."
            );
        }

        const world =
            await response.json();

        const countries =
            window.topojson.feature(
                world,
                world.objects.countries
            );

        easyWorldMap.innerHTML =
            "";

        const width = 1200;
        const height = 680;

        const svg =
            window.d3
                .select(easyWorldMap)
                .append("svg")
                .attr(
                    "viewBox",
                    `0 0 ${width} ${height}`
                )
                .attr(
                    "role",
                    "img"
                )
                .attr(
                    "aria-label",
                    "World map. Orange countries are possible. Click one to eliminate it and turn it white."
                );

        /*
        Give a little breathing room around the world so
        external labels can sit beside small countries.
        */
        const projection =
            window.d3
                .geoNaturalEarth1()
                .fitExtent(
                    [
                        [42, 20],
                        [
                            width - 42,
                            height - 20
                        ]
                    ],
                    countries
                );

        const path =
            window.d3.geoPath(
                projection
            );


        /* COUNTRIES */
        svg
            .append("g")
            .attr(
                "class",
                "map-country-layer"
            )
            .selectAll("path")
            .data(
                countries.features
            )
            .join("path")
            .attr(
                "class",
                "map-country"
            )
            .attr(
                "d",
                path
            )
            .attr(
                "tabindex",
                0
            )
            .attr(
                "role",
                "button"
            )
            .attr(
                "aria-pressed",
                "false"
            )
            .attr(
                "aria-label",
                country => {

                    const code =
                        getCountryShortCode(country);

                    return code
                        ? `${code}: click to eliminate`
                        : "Country: click to eliminate";
                }
            )
            .attr(
                "data-country-id",
                country =>
                    getCountryNumericId(country)
            )
            .on(
                "click",
                function(
                    event,
                    country
                ) {

                    toggleCountryElimination(
                        this,
                        country
                    );
                }
            )
            .on(
                "keydown",
                function(
                    event,
                    country
                ) {

                    if (
                        event.key === "Enter" ||
                        event.key === " "
                    ) {

                        event.preventDefault();

                        toggleCountryElimination(
                            this,
                            country
                        );
                    }
                }
            );


        const labelLayout =
            buildCountryLabelLayout(
                countries.features,
                path,
                width,
                height
            );


        /*
        Draw leader lines first so the country codes stay
        on top of them.
        */
        svg
            .append("g")
            .attr(
                "class",
                "map-leader-layer"
            )
            .selectAll("line")
            .data(
                labelLayout.filter(
                    label => label.external
                )
            )
            .join("line")
            .attr(
                "class",
                "map-label-leader"
            )
            .attr(
                "x1",
                label => label.anchorX
            )
            .attr(
                "y1",
                label => label.anchorY
            )
            .attr(
                "x2",
                label => label.x
            )
            .attr(
                "y2",
                label => label.y
            );


        /* COUNTRY CODES */
        svg
            .append("g")
            .attr(
                "class",
                "map-label-layer"
            )
            .selectAll("text")
            .data(
                labelLayout
            )
            .join("text")
            .attr(
                "class",
                label =>
                    label.external
                        ? "map-country-label external"
                        : "map-country-label"
            )
            .attr(
                "x",
                label => label.x
            )
            .attr(
                "y",
                label => label.y
            )
            .text(
                label => label.code
            );


        worldMapLoaded =
            true;

        updateEliminatedCount();
    }

    catch (error) {

        console.error(
            "Could not load world map:",
            error
        );

        easyWorldMap.innerHTML = `
            <p class="map-error">
                Could not load the world map.
            </p>
        `;
    }
}


function toggleCountryElimination(
    element,
    country
) {

    const countryId =
        getCountryNumericId(country);

    if (!countryId) {
        return;
    }

    if (
        eliminatedCountryIds.has(
            countryId
        )
    ) {

        /*
        Restore:
        white -> orange
        */
        eliminatedCountryIds.delete(
            countryId
        );

        element.classList.remove(
            "eliminated"
        );

        element.setAttribute(
            "aria-pressed",
            "false"
        );

        element.setAttribute(
            "aria-label",
            `${getCountryShortCode(country) || "Country"}: click to eliminate`
        );
    }

    else {

        /*
        Eliminate:
        orange -> white
        */
        eliminatedCountryIds.add(
            countryId
        );

        element.classList.add(
            "eliminated"
        );

        element.setAttribute(
            "aria-pressed",
            "true"
        );

        element.setAttribute(
            "aria-label",
            `${getCountryShortCode(country) || "Country"}: eliminated; click to restore`
        );
    }

    updateEliminatedCount();
}


// ==================================================
// FLAGS
// ==================================================

function getFlagUrl(culture) {

    if (
        specialFlagUrls[culture]
    ) {

        return specialFlagUrls[culture];
    }

    const code =
        cultureFlagCodes[culture];

    if (!code) {
        return null;
    }

    return (
        `https://flagcdn.com/w320/${code}.png`
    );
}


function renderFlagBackground() {

    if (
        !flagBackground ||
        cultureList.length === 0
    ) {
        return;
    }

    flagBackground.innerHTML =
        "";

    let cultures =
        cultureList.filter(
            culture =>
                getFlagUrl(culture)
        );

    cultures =
        shuffleArray(cultures);

    const narrowScreen =
        window.innerWidth < 700;

    if (narrowScreen) {

        cultures =
            cultures.slice(
                0,
                Math.min(
                    40,
                    cultures.length
                )
            );
    }

    const screenWidth =
        window.innerWidth;

    const screenHeight =
        window.innerHeight;

    let columns;

    if (screenWidth >= 1800) {
        columns = 13;
    }

    else if (screenWidth >= 1400) {
        columns = 11;
    }

    else if (screenWidth >= 1050) {
        columns = 9;
    }

    else if (screenWidth >= 700) {
        columns = 7;
    }

    else {
        columns = 4;
    }

    const rows =
        Math.ceil(
            cultures.length /
            columns
        );

    const cellWidth =
        screenWidth / columns;

    const cellHeight =
        screenHeight / rows;

    const cells = [];

    for (
        let row = 0;
        row < rows;
        row++
    ) {

        for (
            let column = 0;
            column < columns;
            column++
        ) {

            cells.push({
                row,
                column
            });
        }
    }

    const shuffledCells =
        shuffleArray(cells);

    cultures.forEach(
        function(
            culture,
            index
        ) {

            const cell =
                shuffledCells[index];

            if (!cell) {
                return;
            }

            const url =
                getFlagUrl(culture);

            if (!url) {
                return;
            }

            const maxWidth =
                narrowScreen
                    ? 82
                    : 128;

            const minWidth =
                narrowScreen
                    ? 54
                    : 72;

            let width =
                cellWidth *
                (
                    0.54 +
                    Math.random() *
                    0.17
                );

            width =
                Math.max(
                    minWidth,
                    Math.min(
                        maxWidth,
                        width
                    )
                );

            const availableHeight =
                Math.max(
                    36,
                    cellHeight * 0.68
                );

            let height =
                width * 0.62;

            if (
                height >
                availableHeight
            ) {

                height =
                    availableHeight;

                width =
                    height / 0.62;
            }

            const freeX =
                Math.max(
                    0,
                    cellWidth - width
                );

            const freeY =
                Math.max(
                    0,
                    cellHeight - height
                );

            const x =
                (
                    cell.column *
                    cellWidth
                ) +
                (
                    Math.random() *
                    freeX
                );

            const y =
                (
                    cell.row *
                    cellHeight
                ) +
                (
                    Math.random() *
                    freeY
                );

            const tile =
                document.createElement(
                    "div"
                );

            tile.className =
                "flag-tile";

            tile.style.width =
                `${width}px`;

            tile.style.height =
                `${height}px`;

            tile.style.left =
                `${x}px`;

            tile.style.top =
                `${y}px`;

            const rotation =
                Math.random() * 8 - 4;

            tile.style.setProperty(
                "--rotation",
                `${rotation.toFixed(2)}deg`
            );

            const image =
                document.createElement(
                    "img"
                );

            image.src =
                url;

            image.alt =
                "";

            image.loading =
                "lazy";

            image.draggable =
                false;

            image.addEventListener(
                "error",
                () => tile.remove()
            );

            tile.appendChild(
                image
            );

            flagBackground.appendChild(
                tile
            );
        }
    );
}


// ==================================================
// STICKY NOTES
// ==================================================

const stickyNoteColors = [
    "note-yellow",
    "note-pink",
    "note-blue",
    "note-mint",
    "note-lilac",
    "note-peach"
];


function resetClues() {

    stickyNoteCount = 0;

    stickyNotesLayer.innerHTML =
        "";

    stickyNotesLayer.hidden =
        false;
}


function rectanglesOverlap(
    first,
    second,
    gap = 0
) {

    return !(
        first.right + gap <= second.left ||
        first.left - gap >= second.right ||
        first.bottom + gap <= second.top ||
        first.top - gap >= second.bottom
    );
}


function candidateRect(
    left,
    top,
    width,
    height
) {

    return {
        left,
        top,
        right:
            left + width,
        bottom:
            top + height
    };
}


function getProtectedGameRect() {

    const rect =
        gameScreen.getBoundingClientRect();

    /*
    Extra space is intentional. Sticky notes are rotated,
    so protecting only the exact card rectangle can still
    leave a corner visually underneath the card.
    */
    return {
        left: rect.left - 28,
        right: rect.right + 28,
        top: rect.top - 28,
        bottom: rect.bottom + 28
    };
}


function getProtectedMapRect() {

    if (
        currentGameMode !== "easy" ||
        easyMapPanel.hidden ||
        mapExpanded
    ) {
        return null;
    }

    const rect =
        easyMapPanel.getBoundingClientRect();

    return {
        left: rect.left - 22,
        right: rect.right + 22,
        top: rect.top - 22,
        bottom: rect.bottom + 22
    };
}


function getProtectedRects() {

    const protectedRects = [];

    if (!gameScreen.hidden) {
        protectedRects.push(
            getProtectedGameRect()
        );
    }

    const mapRect =
        getProtectedMapRect();

    if (mapRect) {
        protectedRects.push(
            mapRect
        );
    }

    return protectedRects;
}


function getOtherNoteRects(
    ignoredNote = null
) {

    return Array
        .from(
            stickyNotesLayer.querySelectorAll(
                ".sticky-note"
            )
        )
        .filter(
            note =>
                note !== ignoredNote
        )
        .map(
            note =>
                note.getBoundingClientRect()
        );
}


function canMoveStickyTo(
    left,
    top,
    width,
    height
) {

    /*
    A safety buffer accounts for the note rotation and
    shadow so it never appears to tuck underneath the map
    or centre card.
    */
    const safety = 13;

    const candidate =
        candidateRect(
            left - safety,
            top - safety,
            width + safety * 2,
            height + safety * 2
        );

    return !getProtectedRects().some(
        rect =>
            rectanglesOverlap(
                candidate,
                rect,
                0
            )
    );
}


function canInitiallyPlaceSticky(
    left,
    top,
    width,
    height,
    note
) {

    if (
        !canMoveStickyTo(
            left,
            top,
            width,
            height
        )
    ) {
        return false;
    }

    const candidate =
        candidateRect(
            left,
            top,
            width,
            height
        );

    const existing =
        getOtherNoteRects(
            note
        );

    return !existing.some(
        rect =>
            rectanglesOverlap(
                candidate,
                rect,
                8
            )
    );
}


function overlapArea(first, second) {

    const width =
        Math.max(
            0,
            Math.min(first.right, second.right) -
            Math.max(first.left, second.left)
        );

    const height =
        Math.max(
            0,
            Math.min(first.bottom, second.bottom) -
            Math.max(first.top, second.top)
        );

    return width * height;
}


function findStickyPosition(
    note,
    ignoreCurrentPosition = false
) {

    const width =
        note.offsetWidth;

    const height =
        note.offsetHeight;

    const padding = 14;

    const maxLeft =
        Math.max(
            padding,
            window.innerWidth -
            width -
            padding
        );

    const maxTop =
        Math.max(
            padding,
            window.innerHeight -
            height -
            padding
        );

    /*
    First try: natural random placement with no overlap.
    */
    for (
        let attempt = 0;
        attempt < 600;
        attempt++
    ) {

        const left =
            padding +
            Math.random() *
            Math.max(
                1,
                maxLeft - padding
            );

        const top =
            padding +
            Math.random() *
            Math.max(
                1,
                maxTop - padding
            );

        if (
            canInitiallyPlaceSticky(
                left,
                top,
                width,
                height,
                note
            )
        ) {
            return { left, top };
        }
    }

    /*
    If clue space is crowded, scan the viewport and choose
    the valid position with the least note-on-note overlap.
    The map/card remain hard exclusions at all times.
    */
    const otherRects =
        getOtherNoteRects(note);

    let best = null;
    let bestScore = Infinity;

    const step = 22;

    for (
        let top = padding;
        top <= maxTop;
        top += step
    ) {

        for (
            let left = padding;
            left <= maxLeft;
            left += step
        ) {

            if (
                !canMoveStickyTo(
                    left,
                    top,
                    width,
                    height
                )
            ) {
                continue;
            }

            const candidate =
                candidateRect(
                    left,
                    top,
                    width,
                    height
                );

            let score = 0;

            for (const rect of otherRects) {
                score += overlapArea(
                    candidate,
                    rect
                );
            }

            if (
                !ignoreCurrentPosition &&
                note.style.left &&
                note.style.top
            ) {
                const oldLeft =
                    parseFloat(note.style.left) || 0;
                const oldTop =
                    parseFloat(note.style.top) || 0;

                score +=
                    Math.hypot(
                        left - oldLeft,
                        top - oldTop
                    ) * 0.05;
            }

            if (score < bestScore) {
                bestScore = score;
                best = { left, top };
            }

            if (score === 0) {
                return best;
            }
        }
    }

    /*
    Normally unreachable on desktop. If the viewport is so
    small that there is literally no safe fixed position,
    keep the note at the nearest edge rather than placing it
    beneath the card/map. It will be reflowed again on resize.
    */
    if (best) {
        return best;
    }

    return {
        left: Math.max(
            padding,
            window.innerWidth - width - padding
        ),
        top: padding
    };
}


function stickyOverlapsProtectedArea(note) {

    const rect =
        note.getBoundingClientRect();

    return getProtectedRects().some(
        protected =>
            rectanglesOverlap(
                rect,
                protected,
                4
            )
    );
}


function reflowStickyNotes() {

    if (
        mapExpanded ||
        stickyNotesLayer.hidden
    ) {
        return;
    }

    const notes =
        Array.from(
            stickyNotesLayer.querySelectorAll(
                ".sticky-note"
            )
        );

    notes.forEach(
        note => {

            if (
                stickyOverlapsProtectedArea(
                    note
                )
            ) {

                const position =
                    findStickyPosition(
                        note,
                        true
                    );

                note.style.left =
                    `${position.left}px`;

                note.style.top =
                    `${position.top}px`;
            }
        }
    );
}


function makeStickyDraggable(note) {

    let dragging = false;

    let startMouseX = 0;
    let startMouseY = 0;

    let startLeft = 0;
    let startTop = 0;

    note.addEventListener(
        "pointerdown",
        function(event) {

            dragging = true;

            note.classList.add(
                "dragging"
            );

            highestStickyZ += 1;

            note.style.zIndex =
                highestStickyZ;

            startMouseX =
                event.clientX;

            startMouseY =
                event.clientY;

            startLeft =
                parseFloat(
                    note.style.left
                ) || 0;

            startTop =
                parseFloat(
                    note.style.top
                ) || 0;

            note.setPointerCapture(
                event.pointerId
            );
        }
    );

    note.addEventListener(
        "pointermove",
        function(event) {

            if (!dragging) {
                return;
            }

            const width =
                note.offsetWidth;

            const height =
                note.offsetHeight;

            let newLeft =
                startLeft +
                event.clientX -
                startMouseX;

            let newTop =
                startTop +
                event.clientY -
                startMouseY;

            newLeft =
                Math.max(
                    6,
                    Math.min(
                        newLeft,
                        window.innerWidth -
                        width -
                        6
                    )
                );

            newTop =
                Math.max(
                    6,
                    Math.min(
                        newTop,
                        window.innerHeight -
                        height -
                        6
                    )
                );

            if (
                canMoveStickyTo(
                    newLeft,
                    newTop,
                    width,
                    height
                )
            ) {

                note.style.left =
                    `${newLeft}px`;

                note.style.top =
                    `${newTop}px`;
            }
        }
    );

    function finishDrag(event) {

        if (!dragging) {
            return;
        }

        dragging = false;

        note.classList.remove(
            "dragging"
        );

        try {

            note.releasePointerCapture(
                event.pointerId
            );
        }

        catch (error) {
            // Nothing needed.
        }
    }

    note.addEventListener(
        "pointerup",
        finishDrag
    );

    note.addEventListener(
        "pointercancel",
        finishDrag
    );
}


function addClue(
    category,
    question,
    answer
) {

    stickyNoteCount += 1;

    const note =
        document.createElement(
            "div"
        );

    const color =
        stickyNoteColors[
            (
                stickyNoteCount - 1
            ) %
            stickyNoteColors.length
        ];

    note.className =
        `sticky-note ${color}`;

    const rotation =
        Math.random() * 6 - 3;

    note.style.setProperty(
        "--note-rotation",
        `${rotation.toFixed(1)}deg`
    );

    note.innerHTML = `
        <div class="sticky-note-category">
            ${
                escapeHtml(
                    formatCategory(
                        category || "Clue"
                    )
                )
            }
        </div>

        <div class="sticky-note-question">
            ${escapeHtml(question)}
        </div>

        <div class="sticky-note-answer">
            ${escapeHtml(answer)}
        </div>

        <div class="sticky-note-number">
            clue ${stickyNoteCount}
        </div>
    `;

    stickyNotesLayer.appendChild(
        note
    );

    const position =
        findStickyPosition(
            note
        );

    note.style.left =
        `${position.left}px`;

    note.style.top =
        `${position.top}px`;

    highestStickyZ += 1;

    note.style.zIndex =
        highestStickyZ;

    makeStickyDraggable(
        note
    );
}


// ==================================================
// LOAD DATA
// ==================================================

async function loadQuestions() {

    try {

        const response =
            await fetch(
                "/api/questions",
                {
                    cache: "no-store"
                }
            );

        questionBank =
            await response.json();

        categorySelect.innerHTML =
            "";

        Object.keys(
            questionBank
        ).forEach(
            function(category) {

                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    category;

                option.textContent =
                    formatCategory(
                        category
                    );

                categorySelect.appendChild(
                    option
                );
            }
        );
    }

    catch (error) {

        console.error(
            "Could not load questions:",
            error
        );
    }
}


async function loadCultures() {

    try {

        const response =
            await fetch(
                "/api/cultures",
                {
                    cache: "no-store"
                }
            );

        cultureList =
            await response.json();

        const playerCulture =
            document.getElementById(
                "player-culture"
            );

        playerCulture.innerHTML = `
            <option value="">
                Select your culture
            </option>
        `;

        cultureGuessInput.innerHTML = `
            <option value="">
                Choose a culture
            </option>
        `;

        cultureList.forEach(
            function(culture) {

                const playerOption =
                    document.createElement(
                        "option"
                    );

                playerOption.value =
                    culture;

                playerOption.textContent =
                    culture;

                playerCulture.appendChild(
                    playerOption
                );

                const guessOption =
                    document.createElement(
                        "option"
                    );

                guessOption.value =
                    culture;

                guessOption.textContent =
                    culture;

                cultureGuessInput.appendChild(
                    guessOption
                );
            }
        );

        renderFlagBackground();
    }

    catch (error) {

        console.error(
            "Could not load cultures:",
            error
        );
    }
}


async function loadPlayerTrophies() {

    const username =
        playerNameInput.value.trim();

    if (!username) {

        playerProfilePreview.hidden =
            true;

        return;
    }

    try {

        const response =
            await fetch(
                `/api/player/${
                    encodeURIComponent(
                        username
                    )
                }`,
                {
                    cache: "no-store"
                }
            );

        const player =
            await response.json();

        playerTrophyCount.textContent =
            player.trophies;

        playerProfilePreview.hidden =
            false;
    }

    catch (error) {

        console.error(
            "Could not load player trophies:",
            error
        );
    }
}


async function loadLeaderboard() {

    try {

        const response =
            await fetch(
                "/api/leaderboard",
                {
                    cache: "no-store"
                }
            );

        const players =
            await response.json();

        leaderboardList.innerHTML =
            "";

        if (
            players.length === 0
        ) {

            leaderboardList.textContent =
                "No players yet. Be the first!";

            return;
        }

        players.forEach(
            function(
                player,
                index
            ) {

                const row =
                    document.createElement(
                        "div"
                    );

                row.className =
                    "leaderboard-row";

                let position =
                    `${index + 1}.`;

                if (index === 0) {
                    position = "🥇";
                }

                else if (index === 1) {
                    position = "🥈";
                }

                else if (index === 2) {
                    position = "🥉";
                }

                row.innerHTML = `
                    <span class="leaderboard-position">
                        ${position}
                    </span>

                    <span class="leaderboard-name">
                        ${
                            escapeHtml(
                                player.username
                            )
                        }
                    </span>

                    <span class="leaderboard-trophies">
                        🏆 ${player.trophies}
                    </span>
                `;

                leaderboardList.appendChild(
                    row
                );
            }
        );
    }

    catch (error) {

        leaderboardList.textContent =
            "Could not load leaderboard.";

        console.error(error);
    }
}


playerNameInput.addEventListener(
    "blur",
    loadPlayerTrophies
);

playerNameInput.addEventListener(
    "change",
    loadPlayerTrophies
);


loadQuestions();
loadCultures();
loadLeaderboard();


// ==================================================
// RESIZE FLAGS
// ==================================================

let flagResizeTimer = null;

window.addEventListener(
    "resize",
    function() {

        clearTimeout(
            flagResizeTimer
        );

        flagResizeTimer =
            setTimeout(
                renderFlagBackground,
                300
            );
    }
);


window.addEventListener(
    "resize",
    function() {
        window.clearTimeout(
            window.__cultureGuessrNoteReflowTimer
        );

        window.__cultureGuessrNoteReflowTimer =
            window.setTimeout(
                reflowStickyNotes,
                260
            );
    }
);


// ==================================================
// TURN UI
// ==================================================

function showMyTurn() {

    questionsLocked = false;
    questionSubmitted = false;

    showQuestionsButton.disabled =
        false;

    showQuestionsButton.textContent =
        "Show Questions";

    categorySelect.disabled =
        false;

    turnControls.hidden =
        false;

    answerPanel.hidden =
        true;

    guessPanel.hidden =
        true;

    questionOptions.innerHTML =
        "";

    errorMessage.textContent =
        "";

    gameStatus.textContent =
        "🎯 Your turn — choose a category, ask a question or make a guess.";
}


function showOpponentTurn() {

    turnControls.hidden =
        true;

    answerPanel.hidden =
        true;

    guessPanel.hidden =
        true;

    questionOptions.innerHTML =
        "";

    errorMessage.textContent =
        "";

    gameStatus.textContent =
        `⏳ Waiting for ${opponentName}...`;
}


// ==================================================
// JOIN
// ==================================================

joinForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();

        const name =
            playerNameInput.value.trim();

        const culture =
            document
                .getElementById(
                    "player-culture"
                )
                .value
                .trim();

        // Reads the actual hidden field that the
        // Normal/Easy buttons update.
        const mode =
            gameModeValue.value === "easy"
                ? "easy"
                : "normal";

        if (
            !name ||
            !culture
        ) {

            errorMessage.textContent =
                "Please enter your name and culture.";

            return;
        }

        myName =
            name;

        errorMessage.textContent =
            "";

        joinScreen.hidden =
            true;

        leaderboardSection.hidden =
            true;

        statusScreen.hidden =
            false;

        statusTitle.textContent =
            "Connecting...";

        statusText.textContent =
            mode === "easy"
                ? "Joining the Easy Mode queue."
                : "Joining the Normal Mode queue.";

        const protocol =
            window.location.protocol === "https:"
                ? "wss"
                : "ws";

        socket =
            new WebSocket(
                `${protocol}://${window.location.host}/ws`
            );

        socket.addEventListener(
            "open",
            function() {

                socket.send(
                    JSON.stringify({
                        type:
                            "join",

                        name,
                        culture,
                        mode
                    })
                );
            }
        );

        socket.addEventListener(
            "message",
            function(event) {

                const data =
                    JSON.parse(
                        event.data
                    );

                handleServerMessage(
                    data
                );
            }
        );

        socket.addEventListener(
            "error",
            function() {

                errorMessage.textContent =
                    "Could not connect to server.";
            }
        );
    }
);


// ==================================================
// SERVER MESSAGES
// ==================================================

function handleServerMessage(data) {

    if (
        data.type === "waiting"
    ) {

        statusTitle.textContent =
            "Waiting for another player...";

        const waitingMode =
            data.mode === "easy"
                ? "Easy"
                : "Normal";

        statusText.textContent =
            `You're in the ${waitingMode} Mode queue 🌎`;
    }


    else if (
        data.type === "matched"
    ) {

        myId =
            data.you.id;

        opponentId =
            data.opponent.id;

        opponentName =
            data.opponent.name;

        guessesRemaining =
            data.guesses_remaining;

        currentRound =
            data.round || 1;

        setGameModeUI(
            data.mode || "normal"
        );

        resetEasyMap();
        resetClues();
        updateGuessDisplays();

        roundNumber.textContent =
            currentRound;

        statusScreen.hidden =
            true;

        gameScreen.hidden =
            false;

        currentGameId.textContent =
            data.game_id;

        currentOpponent.textContent =
            opponentName;

        gameOverPanel.hidden =
            true;

        if (data.your_turn) {
            showMyTurn();
        }

        else {
            showOpponentTurn();
        }
    }


    else if (
        data.type === "question_asked"
    ) {

        turnControls.hidden =
            true;

        guessPanel.hidden =
            true;

        if (
            data.asker_id === myId
        ) {

            gameStatus.textContent =
                `💬 Question sent. Waiting for ${opponentName} to answer...`;
        }

        else {

            gameStatus.textContent =
                `${opponentName} asked you a question.`;

            incomingQuestion.textContent =
                data.question;

            answerInput.value =
                "";

            answerPanel.hidden =
                false;

            sendAnswerButton.disabled =
                false;

            sendAnswerButton.textContent =
                "Send Answer";

            errorMessage.textContent =
                "";
        }
    }


    else if (
        data.type === "answer_checking"
    ) {

        gameStatus.textContent =
            "🤖 AI referee is checking your answer...";

        sendAnswerButton.disabled =
            true;

        sendAnswerButton.textContent =
            "Checking...";
    }


    else if (
        data.type === "answer_rejected"
    ) {

        answerPanel.hidden =
            false;

        sendAnswerButton.disabled =
            false;

        sendAnswerButton.textContent =
            "Send Answer";

        gameStatus.textContent =
            "❌ AI referee rejected that answer. Try again.";

        errorMessage.textContent =
            data.reason
                ? `AI referee: ${data.reason}`
                : "";

        answerInput.focus();
    }


    else if (
        data.type === "answer_received"
    ) {

        answerPanel.hidden =
            true;

        sendAnswerButton.disabled =
            false;

        sendAnswerButton.textContent =
            "Send Answer";

        answerInput.value =
            "";

        errorMessage.textContent =
            "";

        if (
            data.answerer_id === opponentId
        ) {

            addClue(
                data.category,
                data.question,
                data.answer
            );
        }

        currentRound =
            data.round;

        roundNumber.textContent =
            currentRound;

        if (
            data.next_turn === myId
        ) {
            showMyTurn();
        }

        else {
            showOpponentTurn();
        }
    }


    else if (
        data.type === "guess_result"
    ) {

        guessPanel.hidden =
            true;

        turnControls.hidden =
            true;

        if (
            data.player_id === myId
        ) {

            guessesRemaining =
                data.guesses_remaining;

            updateGuessDisplays();

            gameStatus.textContent =
                `❌ Wrong guess! ${guessesRemaining} guesses remaining.`;
        }

        else {

            gameStatus.textContent =
                `❌ ${opponentName} guessed incorrectly.`;
        }

        if (
            data.next_turn === myId
        ) {

            setTimeout(
                showMyTurn,
                5000
            );
        }

        else {

            setTimeout(
                showOpponentTurn,
                5000
            );
        }
    }


    else if (
        data.type === "game_over"
    ) {

        turnControls.hidden =
            true;

        answerPanel.hidden =
            true;

        guessPanel.hidden =
            true;

        gameOverPanel.hidden =
            false;

        const me =
            data.players.find(
                player =>
                    player.id === myId
            );

        const opponent =
            data.players.find(
                player =>
                    player.id === opponentId
            );

        const myTrophies =
            data.trophies?.[myName]
            ?? 0;

        if (
            data.reason === "afk"
        ) {

            if (
                data.winner_id === myId
            ) {

                gameOverTitle.textContent =
                    "🏆 You Win!";

                gameOverMessage.textContent =
                    `${data.afk_player_name} was inactive for 1 minute. `
                    +
                    `The match ended automatically. `
                    +
                    `🏆 You now have ${myTrophies}.`;
            }

            else {

                gameOverTitle.textContent =
                    "⏱️ Match Ended";

                gameOverMessage.textContent =
                    `You were inactive for 1 minute, so ${data.winner_name} wins. `
                    +
                    `🏆 You now have ${myTrophies}.`;
            }

            gameStatus.textContent =
                "Match ended due to inactivity.";
        }

        else if (
            data.winner_id === myId
        ) {

            gameOverTitle.textContent =
                "🏆 You Win!";

            gameOverMessage.textContent =
                `${opponentName} was representing ${opponent.culture}. `
                +
                `You were representing ${me.culture}. `
                +
                `You gained a trophy! `
                +
                `🏆 You now have ${myTrophies}.`;

            gameStatus.textContent =
                "Game finished.";
        }

        else {

            gameOverTitle.textContent =
                `😔 ${data.winner_name} wins!`;

            gameOverMessage.textContent =
                `${opponentName} was representing ${opponent.culture}. `
                +
                `You were representing ${me.culture}. `
                +
                `You lost a trophy. `
                +
                `🏆 You now have ${myTrophies}.`;

            gameStatus.textContent =
                "Game finished.";
        }

        loadLeaderboard();

        setTimeout(
            () =>
                window.location.reload(),
            5000
        );
    }


    else if (
        data.type === "opponent_left"
    ) {

        turnControls.hidden =
            true;

        answerPanel.hidden =
            true;

        guessPanel.hidden =
            true;

        gameStatus.textContent =
            "Your opponent disconnected.";
    }


    else if (
        data.type === "error"
    ) {

        errorMessage.textContent =
            data.message;
    }
}


// ==================================================
// QUESTIONS
// ==================================================

showQuestionsButton.addEventListener(
    "click",
    function() {

        if (questionsLocked) {
            return;
        }

        const category =
            categorySelect.value;

        const questions =
            questionBank[category];

        if (
            !questions ||
            questions.length === 0
        ) {
            return;
        }

        questionsLocked =
            true;

        questionSubmitted =
            false;

        showQuestionsButton.disabled =
            true;

        showQuestionsButton.textContent =
            "Questions Locked 🔒";

        categorySelect.disabled =
            true;

        questionOptions.innerHTML =
            "";

        const choices =
            shuffleArray(
                questions
            ).slice(
                0,
                3
            );

        choices.forEach(
            function(question) {

                const button =
                    document.createElement(
                        "button"
                    );

                button.type =
                    "button";

                button.className =
                    "question-button";

                button.textContent =
                    question;

                button.addEventListener(
                    "click",
                    function() {

                        if (
                            questionSubmitted
                        ) {
                            return;
                        }

                        questionSubmitted =
                            true;

                        questionOptions
                            .querySelectorAll(
                                ".question-button"
                            )
                            .forEach(
                                questionButton => {

                                    questionButton.disabled =
                                        true;
                                }
                            );

                        gameStatus.textContent =
                            "💬 Question selected. Sending to opponent...";

                        socket.send(
                            JSON.stringify({
                                type:
                                    "ask_question",

                                category,
                                question
                            })
                        );
                    }
                );

                questionOptions.appendChild(
                    button
                );
            }
        );
    }
);


// ==================================================
// ANSWER
// ==================================================

sendAnswerButton.addEventListener(
    "click",
    function() {

        const answer =
            answerInput.value.trim();

        if (!answer) {
            return;
        }

        gameStatus.textContent =
            "🤖 Sending answer to AI referee...";

        sendAnswerButton.disabled =
            true;

        sendAnswerButton.textContent =
            "Checking...";

        errorMessage.textContent =
            "";

        socket.send(
            JSON.stringify({
                type:
                    "answer_question",

                answer
            })
        );
    }
);


// ==================================================
// GUESS
// ==================================================

openGuessButton.addEventListener(
    "click",
    function() {

        guessPanel.hidden =
            false;

        cultureGuessInput.value =
            "";

        cultureGuessInput.focus();
    }
);


cancelGuessButton.addEventListener(
    "click",
    function() {

        guessPanel.hidden =
            true;
    }
);


submitGuessButton.addEventListener(
    "click",
    function() {

        const guess =
            cultureGuessInput.value.trim();

        if (!guess) {
            return;
        }

        socket.send(
            JSON.stringify({
                type:
                    "make_guess",

                guess
            })
        );

        guessPanel.hidden =
            true;
    }
);
