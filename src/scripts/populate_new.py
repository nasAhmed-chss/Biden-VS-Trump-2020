import json
from pymongo import MongoClient

# Connect to MongoDB
client = MongoClient("mongodb+srv://mahim:mahim123@416-project.cxq1l.mongodb.net/")
db = client["mainData"]
collection = db["Mississippi_Master_Data"]

# Load the GeoJSON file
file_path = "C:/Users/mohta/Downloads/MS_ABSOLUTE_FINAL.geojson"
with open(file_path, "r") as f:
    geojson_data = json.load(f)

# Extract features and ensure it is a dictionary with lists
features = geojson_data.get("features")
if not isinstance(features, dict):
    raise ValueError("The 'features' key does not contain a dictionary.")

# Process each list in the features dictionary
for list_name, feature_list in features.items():
    if not isinstance(feature_list, list):
        raise ValueError(f"The '{list_name}' key does not contain a list.")
    
    chunk_size = 100  # Adjust based on the size of your data

    for i in range(0, len(feature_list), chunk_size):
        chunk = feature_list[i:i + chunk_size]
        chunk_data = {
            "list_name": list_name,
            "features": chunk
        }
        if(i == 0) :
            collection.insert_one(chunk_data);
        else :
            collection.update_one(
                {"list_name": list_name},   # Query to find the target document
                {"$push": {"features": {"$each": chunk}}}  # Push the chunk's features to the array
            )
        print(f"Inserted chunk {i // chunk_size} from {list_name}")
