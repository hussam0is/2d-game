# main.py
# Entry point for running the tournament and visualization
import os
import time
from agents.train_agent import AGENT_TYPES, MODELS_DIR
from arena_env import ArenaEnv
from player import Player
from visualization import render_arena, log_event, set_game_stats
from stable_baselines3 import PPO
import pygame

NUM_AGENTS = 2
ARENA_SIZE = (800, 600)

# Load models for each agent type
def load_models():
    models = {}
    for agent_type in AGENT_TYPES:
        model_path = os.path.join(MODELS_DIR, f"ppo_{agent_type}.zip")
        if os.path.exists(model_path):
            models[agent_type] = PPO.load(model_path)
        else:
            models[agent_type] = None  # fallback to random
    return models

def run_tournament(num_rounds=3):
    models = load_models()
    win_counts = {a: 0 for a in AGENT_TYPES}
    clock = pygame.time.Clock()
    for round_idx in range(num_rounds):
        log_event(f"--- Round {round_idx+1} ---")
        # Pick two distinct abilities for 1v1
        agent_types = AGENT_TYPES[:2]
        # Start positions: left and right
        start_positions = [(100, ARENA_SIZE[1]//2), (ARENA_SIZE[0]-100, ARENA_SIZE[1]//2)]
        players = [Player(i, ability_type=agent_types[i], arena_size=ARENA_SIZE, start_pos=start_positions[i]) for i in range(NUM_AGENTS)]
        env = ArenaEnv(num_agents=NUM_AGENTS, arena_size=ARENA_SIZE)
        obs = env.reset()
        done = False
        events = []
        winner = None
        last_moves = [0] * NUM_AGENTS
        while not done:
            actions = []
            for i, p in enumerate(players):
                if not p.is_alive:
                    actions.extend([0, 0])
                    continue
                model = models.get(p.ability_type)
                if model:
                    action, _ = model.predict(obs, deterministic=True)
                    move = action[0] if hasattr(action, '__iter__') else action
                    ability = 1 if p.cooldown == 0 else 0
                else:
                    move = pygame.key.get_pressed()[pygame.K_RIGHT]  # fallback: always right
                    ability = 1 if p.cooldown == 0 else 0
                # Only call move() if action changed
                if move != last_moves[i]:
                    p.move(move)
                    last_moves[i] = move
                if ability:
                    p.use_ability()
                actions.extend([move, ability])
            # Continuous movement: update position every frame
            for p in players:
                p.update_position(ARENA_SIZE)
            obs, rewards, done, info = env.step(actions)
            # Only update health/cooldown from obs
            for i, p in enumerate(players):
                _, _, p.health, p.cooldown = obs[i*4:i*4+4]
                if p.health <= 0 and p.is_alive:
                    p.is_alive = False
                    events.append(f"Agent {p.ability_type} eliminated!")
                p.tick()  # update animation timers
            # Set stats for display
            set_game_stats({'round': round_idx+1, 'winner': winner})
            render_arena(players, events, show_fight_ui=True)
            clock.tick(60)  # Limit to 60 FPS
            for event in events:
                log_event(event)
            events.clear()
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    done = True
        # Determine winner
        alive = [p for p in players if p.is_alive]
        if alive:
            winner = alive[0].ability_type
            win_counts[winner] += 1
            log_event(f"Winner: {winner}")
        else:
            log_event("No winner!")
        # Show winner in stats box for a moment
        set_game_stats({'round': round_idx+1, 'winner': winner if alive else 'No winner'})
        render_arena(players, events, show_fight_ui=True)
        pygame.time.wait(1000)
    print("Tournament Results:")
    for k, v in win_counts.items():
        print(f"{k}: {v} wins")

def main():
    run_tournament(num_rounds=3)

if __name__ == "__main__":
    main() 