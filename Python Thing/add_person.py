import requests
import random
import argparse

FIRST_NAMES = ["John", "Jane", "Alice", "Bob", "Charlie", "Diana", "Edward", "Fiona", "George", "Hannah"]
LAST_NAMES = ["Smith", "Doe", "Johnson", "Brown", "Taylor", "Miller", "Wilson", "Moore", "Anderson", "Thomas"]

def add_person(first_name=None, last_name=None):
    first_name = first_name or random.choice(FIRST_NAMES)
    last_name = last_name or random.choice(LAST_NAMES)
    payload = {
        "first_name": first_name,
        "last_name": last_name
    }
    
    url = "http://localhost:8080/persons"
    
    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()
        print(f"Successfully added: {first_name} {last_name}")
        print(f"Response: {response.json()}")
    except requests.exceptions.RequestException as e:
        print(f"Failed to add person: {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Add a person to the Go service.")
    parser.add_argument("--first", help="First name to add")
    parser.add_argument("--last", help="Last name to add")
    
    args = parser.parse_args()
    add_person(first_name=args.first, last_name=args.last)
