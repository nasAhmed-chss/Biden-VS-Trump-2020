from pymongo import MongoClient
from gridfs import GridFS

# Connect to MongoDB
client = MongoClient("mongodb+srv://mahim:mahim123@416-project.cxq1l.mongodb.net/")
db = client["mainData"]  # Use your database name
fs = GridFS(db)  # Initialize GridFS

# File path
file_path = "C:/Users/mohta/Downloads/CT_ABSOLUTE_FINAL.geojson"

# Upload the file
with open(file_path, "rb") as f:  # Open the file in binary mode
    file_id = fs.put(f, filename="CT_ABSOLUTE_FINAL.geojson")
    print(f"File uploaded with ID: {file_id}")
