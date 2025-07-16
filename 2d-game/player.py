# player.py
import random
from abilities import ABILITIES

class Player:
    def __init__(self, player_id, ability_type=None, arena_size=(800, 600), start_pos=None):
        self.player_id = player_id
        self.health = 100
        self.ability_type = ability_type or random.choice(list(ABILITIES.keys()))
        self.ability = ABILITIES[self.ability_type]
        self.cooldown = 0
        if start_pos:
            self.x, self.y = start_pos
        else:
            self.x = random.uniform(0, arena_size[0])
            self.y = random.uniform(0, arena_size[1])
        self.radius = 20
        self.is_alive = True
        # Animation state
        self.action_state = 'idle'  # 'idle', 'move', 'ability'
        self.action_timer = 0
        self.last_direction = 0
        # Velocity for continuous movement
        self.vx = 0
        self.vy = 0
        self.speed = 5

    def move(self, direction):
        # direction: 0=none, 1=up, 2=down, 3=left, 4=right
        if direction == 1:
            self.vx, self.vy = 0, -self.speed
        elif direction == 2:
            self.vx, self.vy = 0, self.speed
        elif direction == 3:
            self.vx, self.vy = -self.speed, 0
        elif direction == 4:
            self.vx, self.vy = self.speed, 0
        else:
            self.vx, self.vy = 0, 0
        if direction != 0:
            self.action_state = 'move'
            self.action_timer = 5
            self.last_direction = direction
        else:
            self.action_state = 'idle'

    def update_position(self, arena_size=(800, 600)):
        self.x = min(max(self.x + self.vx, 0), arena_size[0])
        self.y = min(max(self.y + self.vy, 0), arena_size[1])

    def stop(self):
        self.vx, self.vy = 0, 0
        self.action_state = 'idle'

    def use_ability(self):
        if self.cooldown == 0:
            self.cooldown = self.ability.cooldown
            self.action_state = 'ability'
            self.action_timer = 8
            return True
        return False

    def tick(self):
        if self.cooldown > 0:
            self.cooldown -= 1
        if self.action_timer > 0:
            self.action_timer -= 1
        else:
            self.action_state = 'idle' 