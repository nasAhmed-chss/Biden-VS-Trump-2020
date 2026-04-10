import json

# with open(r"C:\Users\mohta\Downloads\MS_FINAL_3.geojson", "r") as file:
#     data = json.load(file)

# # Minify the JSON
# with open(r"C:\Users\mohta\Downloads\Mississippi_Master_Data.geojson", "w") as file:
#     json.dump(data, file, separators=(",", ":"))

with open(r"C:\Users\mohta\Downloads\MS_FINAL_5.geojson", "r") as file:
    data = json.load(file)

# Minify the JSON
with open(r"C:\Users\mohta\Downloads\Mississippi_Master_Data.geojson", "w") as file:
    json.dump(data, file, separators=(",", ":"))