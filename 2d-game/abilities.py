# abilities.py

class Ability:
    def __init__(self, name, cooldown, effect):
        self.name = name
        self.cooldown = cooldown
        self.effect = effect  # function or description

# Example abilities (expanded)
ABILITIES = {
    'fire': Ability('Fire', cooldown=5, effect='ranged_damage_over_time'),
    'water': Ability('Water', cooldown=7, effect='defensive_shield_or_heal'),
    'sword': Ability('Sword', cooldown=3, effect='melee_high_damage'),
    'ice': Ability('Ice', cooldown=6, effect='slow_opponent'),
    'wind': Ability('Wind', cooldown=4, effect='push_away'),
} 