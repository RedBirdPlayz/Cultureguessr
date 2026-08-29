# 🌍 CultureGuessr

### **Ask. Guess. Connect.**

**CultureGuessr** is a real-time multiplayer cultural guessing game created for **SYNCS Hack 2026**.

Players secretly choose a culture they are representing, then take turns asking questions about **food, geography, daily life, conventions, numbers, and culture**. Using the clues they collect, players try to guess their opponent's culture before the opponent guesses theirs.

> **The aim is simple: turn cultural differences into conversation.**

---

## 💡 Inspiration

Students can be surrounded by people from many different cultures without ever having a meaningful conversation with them.

**CultureGuessr turns that awkward first conversation into a game.**

Instead of asking someone directly where they are from, players learn about each other through questions, clues, and deduction.

> **Start with differences, end with connection.**

---

## 🎮 How It Works

1. Enter a player name.
2. Select the culture you want to represent.
3. Choose a game mode:

   * 🟢 **Normal**
   * 🗺️ **Easy**
4. Get matched with another player using the same game mode.
5. Take turns asking cultural questions.
6. The opponent answers the question.
7. Their answers become clues.
8. Use the clues to guess their culture.
9. Each player has **3 guesses**.
10. The first correct guess wins.

Players gain or lose trophies based on the result of the match.

---

## 🎯 Game Modes

### 🟢 Normal Mode

The original **CultureGuessr** experience.

Players rely entirely on the questions they ask and the clues provided by their opponent.

---

### 🗺️ Easy Mode

Easy Mode includes an interactive world map.

Countries begin highlighted and can be eliminated as clues are collected.

Players can:

* Click countries to eliminate them.
* Click them again to restore them.
* Use three-letter country codes such as:

  * `PAK`
  * `AUS`
  * `USA`
  * `GBR`
  * `IND`
* Reset the map at any time.

> 🔒 The map is private to each player and is **not shared with the opponent**.

---

## 🤖 AI Referee

CultureGuessr uses an AI referee powered by **Groq**.

When a player submits an answer, the AI checks whether the answer is reasonably compatible with the culture they selected.

The referee can return:

| Result      | Meaning                                                        |
| ----------- | -------------------------------------------------------------- |
| `ACCEPT`    | The answer is reasonably compatible with the selected culture. |
| `REJECT`    | The answer is clearly false or deliberately misleading.        |
| `UNCERTAIN` | The answer is subjective or difficult to confidently classify. |

The system is intentionally conservative.

Subjective, personal, approximate, and culturally variable answers should normally be accepted.

Answers are rejected only when they are **clearly false or deliberately misleading**.

This helps prevent cheating without forcing players into cultural stereotypes.

---

## 🏆 Trophy System

Each player has a trophy score.

| Result | Trophy Change |
| ------ | ------------: |
| 🏆 Win |        **+1** |
| ❌ Loss |        **-1** |

A player's trophy count can never fall below **0**.

The homepage displays a **Top 10 leaderboard**.

---

## ⏱️ AFK Protection

Players have approximately **60 seconds** to perform the required action during their turn.

If a player remains inactive for too long, the other player automatically wins.

> ⏸️ The AFK timer pauses while the AI referee is checking an answer.

---

## 📝 Clue System

When your opponent answers one of your questions, their answer is added as a clue.

Clues appear as **draggable sticky notes** around the game interface.

> 💡 Only your opponent's answers become clues. Your own answers are not shown to you as clues.

---

## ❓ Question Categories

CultureGuessr contains questions across several categories:

* 🏛️ **Conventions**
* 🍜 **Food**
* 🌎 **Geography**
* 🧑‍🤝‍🧑 **Culture**
* 🏠 **Daily Life**
* 🔢 **Numbers**

Players choose a category and receive a selection of questions from that category.

Questions are **locked after being generated for the current turn** to prevent rerolling.

---

## 🧑‍💻 Tech Stack

### Backend

* 🐍 **Python**
* ⚡ **FastAPI**
* 🔌 **WebSockets**
* 🗄️ **SQLite**
* 🤖 **Groq API**
* 🚀 **Uvicorn**

### Frontend

* 🌐 **HTML**
* 🎨 **CSS**
* ⚙️ **JavaScript**
* 📊 **D3.js**
* 🗺️ **TopoJSON**
* 🌍 **World Atlas**

---

## 📁 Project Structure

```text
cultureguessr/
│
├── backend/
│   ├── main.py
│   ├── database.py
│   └── game.py
│
├── frontend/
│   ├── index.html
│   ├── game.html
│   ├── leaderboard.html
│   ├── style.css
│   └── app.js
│
├── data/
│   ├── questions.json
│   ├── cultures.json
│   └── cultureguessr.db
│
├── requirements.txt
├── README.md
└── .gitignore
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd cultureguessr
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure the Groq API

Create a `.env` file and add your Groq API key:

```env
GROQ_API_KEY=your_api_key_here
```

### 4. Start the server

```bash
uvicorn backend.main:app --reload
```

The game should then be available at:

```text
http://localhost:8000
```

---

## 🎮 Built For

**SYNCS Hack 2026**

CultureGuessr was built to explore how games can turn cultural differences into opportunities for **curiosity, conversation, and connection**.

> 🌍 **Ask. Guess. Connect.**
