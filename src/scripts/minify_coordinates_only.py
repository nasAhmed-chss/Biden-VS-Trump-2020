import json

def compact_coordinates(coordinates):
    """
    Recursively compact the coordinates into a single line.
    """
    if isinstance(coordinates[0], list):
        # Recursively process nested lists
        return [compact_coordinates(coord) for coord in coordinates]
    else:
        # Return the innermost coordinates as is
        return coordinates

def compact_geojson(geojson_file, output_file):
    """
    Compact the `coordinates` field inside the GeoJSON structure while keeping the rest of the JSON readable.
    """
    with open(geojson_file, "r") as file:
        data = json.load(file)

    # Traverse to the `features` -> `precincts` -> `geometry` -> `coordinates`
    if "features" in data and isinstance(data["features"], dict) and "precincts" in data["features"]:
        for precinct in data["features"]["precincts"]:
            if isinstance(precinct, dict) and "geometry" in precinct and isinstance(precinct["geometry"], dict):
                if "coordinates" in precinct["geometry"] and isinstance(precinct["geometry"]["coordinates"], list):
                    # Compact the coordinates
                    precinct["geometry"]["coordinates"] = compact_coordinates(precinct["geometry"]["coordinates"])

    # Save the modified JSON back to the file
    with open(output_file, "w") as file:
        json.dump(data, file, indent=4, separators=(",", ":"))  # Compact arrays and objects

# Input and output file paths
geojson_file = r"C:\Users\mohta\Downloads\MS_large_file.geojson"
output_file = r"C:\Users\mohta\Downloads\MS_compacted_coordinates.geojson"

# Compact only the `coordinates` field
compact_geojson(geojson_file, output_file)

print("Coordinates successfully compacted!")
