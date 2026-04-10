import json

# Load the JSON file
with open("C:/Users/mohta/Downloads/MS_ABSOLUTE_FINAL.geojson", "r") as f:
    data = json.load(f)

print(type(data))  # Check if it's a list or dictionary
print(type(data["features"]))  # Check if it's a list or dictionary
print(type(data["features"]["precincts"]))  # Check if it's a list or dictionary
print(type(data["features"]["precincts"][0]["geometry"]))  # Check if it's a list or dictionary
print(type(data["features"]["precincts"][0]["geometry"]["coordinates"]))  # Check if it's a list or dictionary
print(data.keys())
