import requests

response = requests.get('http://localhost:5000/api/players')
players = response.json()

if players:
    print("First player data:")
    print(players[0])
    print("\nAvailable columns:")
    print(list(players[0].keys()))