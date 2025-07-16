# agents/train_agent.py
import os
from stable_baselines3 import PPO
from arena_env import ArenaEnv

AGENT_TYPES = ['fire', 'water', 'sword', 'ice', 'wind']

MODELS_DIR = os.path.join(os.path.dirname(__file__), 'models')
os.makedirs(MODELS_DIR, exist_ok=True)

TRAIN_STEPS = 10000


def train_agents():
    for agent_type in AGENT_TYPES:
        print(f"Training agent: {agent_type}")
        env = ArenaEnv(num_agents=1)
        model = PPO('MlpPolicy', env, verbose=0)
        model.learn(total_timesteps=TRAIN_STEPS)
        model.save(os.path.join(MODELS_DIR, f"ppo_{agent_type}"))
        print(f"Saved model for {agent_type}")

if __name__ == "__main__":
    train_agents() 