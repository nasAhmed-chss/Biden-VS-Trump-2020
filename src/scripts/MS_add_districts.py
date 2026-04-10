import json

with open('MS_precinct_race_income_data.geojson', 'r') as precinct_file:
    precinct_data = json.load(precinct_file)

with open('MS_CD_boundaries.json', 'r') as district_file:
    district_data = json.load(district_file)

combined_data = {
    "type": "FeatureCollection",
    "name": "MS_precinctAndVotingData",
    "crs": precinct_data.get("crs", {"type": "name", "properties": {"name": "urn:ogc:def:crs:EPSG::4269"}}),
    "features": {
        "precincts": precinct_data["features"],  
        "districts": district_data["features"],  
    }
}



with open('MS_FINAL.geojson', 'w') as output_file:
    json.dump(combined_data, output_file, indent=4)

print("Precinct and district data combined successfully!")
