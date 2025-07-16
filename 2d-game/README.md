# 2D Arena RL Tournament

A simple 2D arena-based simulation with multiple AI agents, each with unique abilities, trained via reinforcement learning (Stable Baselines3) and visualized with Pygame.

## Features
- Multiple agent types (fire, water, sword, etc.)
- Custom Gym environment for RL training
- Tournament mode with visualization
- Modular codebase

## Requirements
- Python 3.8+
- pygame
- gym
- stable-baselines3

Install dependencies:
```bash
pip install pygame gym stable-baselines3
```

## How to Run
1. **Train agents:**
   ```bash
   python agents/train_agent.py
   ```
2. **Run tournament:**
   ```bash
   python main.py
   ```

## Project Structure
- `main.py` — Tournament runner and visualization
- `arena_env.py` — Custom Gym environment
- `agents/train_agent.py` — RL training script
- `agents/models/` — Saved models
- `visualization.py` — Pygame rendering
- `abilities.py` — Ability logic
- `player.py` — Player/agent class
- `utils.py` — Helpers 