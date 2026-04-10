import gzip
import json

with open(r"C:\Users\mohta\Downloads\MS_large_file.geojson", "r") as file:
    data = json.load(file)

with gzip.open(r"C:\Users\mohta\Downloads\MS_large_file_zipped.geojson", "wt", encoding="utf-8") as gzfile:
    json.dump(data, gzfile)
