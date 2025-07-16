# arena_env.py
import gym
from gym import spaces
import numpy as np

class ArenaEnv(gym.Env):
    """
    Custom 2D Arena Environment for multi-agent RL.
    Each agent observes positions, health, cooldowns, etc.
    Actions: move (up/down/left/right/none), use ability (yes/no)
    """
    def __init__(self, num_agents=4, arena_size=(800, 600)):
        super().__init__()
        self.num_agents = num_agents
        self.arena_size = arena_size
        self.agent_radius = 20
        self.max_health = 100
        self.action_space = spaces.MultiDiscrete([5, 2] * num_agents)  # 5 moves, 2 ability (per agent)
        # obs: [x, y, health, cooldown] for each agent
        low = np.array([0, 0, 0, 0] * num_agents, dtype=np.float32)
        high = np.array([arena_size[0], arena_size[1], self.max_health, 10] * num_agents, dtype=np.float32)
        self.observation_space = spaces.Box(low, high, dtype=np.float32)
        self.state = None

    def reset(self):
        # Randomize agent positions, full health, no cooldown
        self.state = []
        for _ in range(self.num_agents):
            x = np.random.uniform(0, self.arena_size[0])
            y = np.random.uniform(0, self.arena_size[1])
            health = self.max_health
            cooldown = 0
            self.state.extend([x, y, health, cooldown])
        return np.array(self.state, dtype=np.float32)

    def step(self, actions):
        # actions: [move, ability, move, ability, ...] for each agent
        rewards = [0.0] * self.num_agents
        done = False
        info = {}
        # TODO: Implement movement, ability usage, health/cooldown update, collision, rewards
        # For now, random walk and dummy rewards
        for i in range(self.num_agents):
            idx = i * 4
            move = actions[i*2]
            ability = actions[i*2+1]
            # Move agent
            if move == 1:  # up
                self.state[idx+1] = max(0, self.state[idx+1] - 10)
            elif move == 2:  # down
                self.state[idx+1] = min(self.arena_size[1], self.state[idx+1] + 10)
            elif move == 3:  # left
                self.state[idx] = max(0, self.state[idx] - 10)
            elif move == 4:  # right
                self.state[idx] = min(self.arena_size[0], self.state[idx] + 10)
            # Dummy: random reward for moving
            rewards[i] += np.random.uniform(-0.1, 0.1)
        # Dummy: end after 200 steps
        if not hasattr(self, 'step_count'):
            self.step_count = 0
        self.step_count += 1
        if self.step_count > 200:
            done = True
        return np.array(self.state, dtype=np.float32), rewards, done, info

    def render(self, mode='human'):
        # TODO: Integrate with Pygame visualization
        pass 