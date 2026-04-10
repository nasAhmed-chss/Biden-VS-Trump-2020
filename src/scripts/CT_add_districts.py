import json

with open('CT_precinct_race_income_data.geojson', 'r') as precinct_file:
    precinct_data = json.load(precinct_file)

with open('ct_CD_boundaries.json', 'r') as district_file:
    district_data = json.load(district_file)

combined_data = {
    "type": "FeatureCollection",
    "name": "CT_precinct_race_income_data_with_districts",
    "crs": precinct_data.get("crs", {"type": "name", "properties": {"name": "urn:ogc:def:crs:EPSG::4269"}}),
    "features": {
        "precincts": precinct_data["features"],  
        "districts": district_data["features"],  
    }
}

with open('CT_precinct_race_income_with_districts.geojson', 'w') as output_file:
    json.dump(combined_data, output_file, indent=4)

print("Connecticut precinct and district data combined successfully!")
