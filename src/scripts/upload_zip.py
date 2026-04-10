import gzip
import json
from pymongo import MongoClient

# MongoDB connection
client = MongoClient("mongodb+srv://mahim:mahim123@416-project.cxq1l.mongodb.net/")
db = client["mainData"]
collection = db["Mississippi_Master_Data"]

# Path to the compressed file
input_file = r"C:\Users\mohta\Downloads\MS_large_file_zipped.geojson"

# Read and upload data from the GZIP file
with gzip.open(input_file, "rt", encoding="utf-8") as gzfile:
    data = json.load(gzfile)

    # If data is a list of documents
    if isinstance(data, list):
        collection.insert_many(data)
    # If data is a single document
    else:
        collection.insert_one(data)

print("Data uploaded successfully!")
