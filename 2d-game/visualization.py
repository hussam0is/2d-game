# visualization.py
import pygame
import math

COLORS = {
    'fire': (255, 80, 0),
    'water': (0, 120, 255),
    'sword': (180, 180, 180),
    'ice': (0, 255, 255),
    'wind': (180, 255, 180),
}

WIDTH, HEIGHT = 800, 600

pygame.init()
screen = pygame.display.set_mode((WIDTH, HEIGHT))
font = pygame.font.SysFont(None, 24)

# Store last stats for display
game_stats = {}

def set_game_stats(stats):
    global game_stats
    game_stats = stats

def draw_human(x, y, color, radius, action_state='idle', action_timer=0, direction=0):
    # Animate legs for movement
    leg_swing = 0
    if action_state == 'move':
        leg_swing = math.sin(pygame.time.get_ticks() / 100.0) * radius * 0.5
    # Head
    pygame.draw.circle(screen, color, (int(x), int(y - radius)), int(radius * 0.6), 2)
    # Body (line)
    body_top = (int(x), int(y - radius * 0.4))
    body_bottom = (int(x), int(y + radius * 0.9))
    pygame.draw.line(screen, color, body_top, body_bottom, 3)
    # Arms (lines)
    arm_y = int(y + radius * 0.1)
    pygame.draw.line(screen, color, (int(x - radius * 0.8), arm_y), (int(x + radius * 0.8), arm_y), 3)
    # Left leg (with swing)
    pygame.draw.line(screen, color, body_bottom, (int(x - radius * 0.6 + leg_swing), int(y + radius * 1.7)), 3)
    # Right leg (with swing)
    pygame.draw.line(screen, color, body_bottom, (int(x + radius * 0.6 - leg_swing), int(y + radius * 1.7)), 3)
    # Ability effect
    if action_state == 'ability' and action_timer > 0:
        pygame.draw.circle(screen, (255,255,0), (int(x), int(y)), int(radius * 1.2), 2)
        # Optionally, flash head
        if action_timer % 2 == 0:
            pygame.draw.circle(screen, (255,255,0), (int(x), int(y - radius)), int(radius * 0.6), 2)

def render_stats_box(players, round_num=None, winner=None):
    # Draw a semi-transparent box
    s = pygame.Surface((260, 120), pygame.SRCALPHA)
    s.fill((20, 20, 20, 200))
    y = 8
    if round_num is not None:
        txt = font.render(f'Round: {round_num}', True, (255,255,255))
        s.blit(txt, (8, y))
        y += 24
    for p in players:
        color = COLORS.get(p.ability_type, (255,255,255))
        txt = font.render(f'{p.ability_type.capitalize()} HP: {int(p.health)}  CD: {int(p.cooldown)}', True, color)
        s.blit(txt, (8, y))
        y += 24
    if winner:
        txt = font.render(f'Winner: {winner}', True, (255,255,0))
        s.blit(txt, (8, y))
    # Blit to bottom left
    screen.blit(s, (8, HEIGHT - s.get_height() - 8))

def render_arena(players, events=None, show_fight_ui=False):
    screen.fill((30, 30, 30))
    # Draw ground line for fighting stage
    if show_fight_ui:
        pygame.draw.line(screen, (100, 255, 100), (0, HEIGHT//2+60), (WIDTH, HEIGHT//2+60), 6)
        # Health bars at top
        if len(players) == 2:
            for i, p in enumerate(players):
                color = COLORS.get(p.ability_type, (255,255,255))
                bar_x = 50 if i == 0 else WIDTH-250
                pygame.draw.rect(screen, (60,60,60), (bar_x, 20, 200, 20))
                pygame.draw.rect(screen, color, (bar_x, 20, int(200*p.health/100), 20))
                name_text = font.render(f'{p.ability_type.upper()}', True, color)
                screen.blit(name_text, (bar_x, 45))
    for p in players:
        color = COLORS.get(p.ability_type, (255, 255, 255))
        draw_human(p.x, p.y, color, p.radius, p.action_state, p.action_timer, getattr(p, 'last_direction', 0))
        # Health bar (all int, only if not fight UI)
        if not show_fight_ui:
            pygame.draw.rect(screen, (0,255,0), (int(p.x-20), int(p.y-30), int(40*p.health/100), 5))
        # Player ID
        id_text = font.render(str(p.player_id), True, (255,255,255))
        screen.blit(id_text, (int(p.x-8), int(p.y-8)))
        # Ability cooldown
        if p.cooldown > 0:
            cd_text = font.render(f'CD:{p.cooldown}', True, (255,200,0))
            screen.blit(cd_text, (int(p.x-20), int(p.y+20)))
    # Draw stats box
    round_num = game_stats.get('round') if game_stats else None
    winner = game_stats.get('winner') if game_stats else None
    render_stats_box(players, round_num=round_num, winner=winner)
    if events:
        for i, e in enumerate(events[-5:] if len(events)>5 else events):
            ev_text = font.render(e, True, (255,255,255))
            screen.blit(ev_text, (10, 10 + i*20))
    pygame.display.flip()

def log_event(event):
    print(event) 