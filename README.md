# 🎮 AI Stealth Game

## 📌 Project Description

This project is an **AI-based Stealth Game** where the player must reach a target location while avoiding detection by intelligent enemy agents.

The game is developed using **Python** and the **Flask** web framework to present the game interface in a web environment. Artificial Intelligence techniques are applied to control enemy behavior, making the gameplay more realistic and challenging.

---

## 🧠 Project Idea

The main idea of the game is to simulate a two-dimensional grid-based environment containing obstacles and walkable paths. The player navigates through the environment, while enemy agents act intelligently instead of moving randomly.

Enemy agents are capable of:

* Patrolling predefined areas
* Detecting the player within a limited vision range
* Chasing the player using a search-based pathfinding algorithm

---

## ⚙️ Chosen Technique

* **Search-Based Artificial Intelligence**
* **A* (A-Star) Pathfinding Algorithm**
* Rule-based state management (Patrol / Detection / Chase)

The A* algorithm evaluates nodes using the following cost function:

f(n) = g(n) + h(n)

Where:

* g(n) is the cost from the starting node to the current node
* h(n) is the heuristic estimate to the goal (Manhattan Distance)

---

## 🧩 Algorithm Design

* The game environment is represented as a 2D grid
* Both the player and enemies move in four main directions (up, down, left, right)
* Enemies patrol the map until the player is detected
* Once detected, enemies use the A* algorithm to compute the shortest path to the player
* Paths are updated dynamically as the player moves

---

## 🧪 Experiments & Results

The game was tested using multiple map layouts with different obstacle configurations. The experiments showed that enemies using the A* search algorithm were significantly more effective than enemies with random movement.

Key results include:

* Faster enemy response time
* Optimal path selection around obstacles
* Increased game difficulty and realism

---

## 🛠️ Technologies Used

* Python
* Flask
* HTML / CSS / JavaScript
* A* Search Algorithm

---

## ▶️ How to Run the Project

1. Create and activate a virtual environment
2. Install the required dependencies:

   ```bash
   pip install flask
   ```
3. Run the application:

   ```bash
   python app.py
   ```
4. Open your browser and go to:

   ```
   http://127.0.0.1:5000
   ```

---

## 🎯 Educational Objective

The purpose of this project is to apply Artificial Intelligence concepts, particularly search algorithms, in a practical and interactive application such as game development. The project demonstrates how intelligent agents can make decisions and navigate environments efficiently.

---

## 👩‍🎓 Notes

This project was developed as part of an Artificial Intelligence course and can be extended in the future by adding:

* Multiple levels
* More advanced AI techniques
* Improved graphical interface
