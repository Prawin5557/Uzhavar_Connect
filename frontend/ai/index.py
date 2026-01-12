
// Import necessary libraries
import pygame

# Initialize Pygame
pygame.init()

# Set up the display
screen_width = 800
screen_height = 600
screen = pygame.display.set_mode((screen_width, screen_height))
pygame.display.set_caption("Flappy Game")

# Define colors
black = (0, 0, 0)
white = (255, 255, 255)
red = (255, 0, 0)

# Define game variables
gravity = 1.5
bird_y = screen_height // 2
bird_speed = 0
flap_velocity = -10
game_over = False

# Game loop
while not game_over:
    # Handle events
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            game_over = True
        elif event.type == pygame.KEYDOWN and event.key == pygame.K_SPACE:
            bird_speed += flap_velocity

    # Update the bird's position
    bird_y += bird_speed
    bird_speed += gravity

    # Check for collisions with the ground
    if bird_y > screen_height or bird_y < 0:
        game_over = True

    # Clear the screen
    screen.fill(black)

    # Draw the bird
    pygame.draw.rect(screen, white, (50, bird_y, 30, 30))

    # Update the display
    pygame.display.flip()

# Quit Pygame
pygame.quit()
```