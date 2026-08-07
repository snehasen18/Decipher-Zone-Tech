# 💣 Classic Minesweeper Web Application

A responsive browser-based Minesweeper game built using HTML5, CSS3, and Vanilla JavaScript.

The game includes safe first-click protection, dynamic mine generation, flood-fill cell revealing, flag management, a live timer, mine counter, game status indicators, and victory/defeat result screens.

---

## 🚀 Features

### 🛡️ Safe First Click

- Mines are generated after the first cell is selected.
- The first clicked cell is guaranteed to be safe.
- The surrounding 8 cells are also protected from mines.
- Prevents unfair instant losses at the beginning of the game.

### 💣 Dynamic Mine Generation

- Mines are randomly distributed across the board.
- Mine positions are generated dynamically for every game.
- Prevents predictable game layouts.

### 🌊 Flood-Fill Cell Reveal

- Automatically reveals connected empty cells.
- Uses a **Breadth-First Search (BFS)** based flood-fill algorithm.
- Reveals numbered boundary cells around empty regions.

### 🚩 Flag System

- Right-click cells to place or remove flags.
- Tracks the number of remaining mines.
- Prevents accidental interaction with flagged cells.

### ⏱️ Game HUD

The interface provides real-time game information:

- Remaining mine counter
- Elapsed time
- Current game status
- Reset button

### 🎮 Game States

The reset indicator changes according to the game state:

- 🙂 Playing
- 😎 Victory
- 💀 Game Over

### 🏆 Win & Loss Detection

- Detects when all safe cells have been revealed.
- Detects mine activation and ends the game.
- Displays a result modal after the game ends.
- Allows players to start a new game immediately.

### 🎨 Modern Dark UI

- Dark-themed interface.
- CSS variables for consistent styling.
- Color-coded mine proximity numbers from 1–8.
- Smooth transitions and visual feedback.
- Responsive game board layout.

---

# 🛠️ Technology Stack

| Technology | Purpose |
|------------|---------|
| HTML5 | Game structure, HUD, board and modal elements |
| CSS3 | Responsive layout, dark theme, grid and animations |
| JavaScript ES6+ | Game logic, DOM manipulation and event handling |
| BFS Algorithm | Flood-fill cell revealing |
| CSS Grid | Dynamic Minesweeper board layout |

---

# 🧠 Game Logic

The application follows this basic game flow:

```text
Start Game
    ↓
User Makes First Click
    ↓
Generate Mines
    ↓
Protect First Click + Neighbors
    ↓
Calculate Adjacent Mine Counts
    ↓
Reveal Selected Cell
    ↓
BFS Flood Fill for Empty Cells
    ↓
Check Win / Loss Condition
    ↓
Display Game Result