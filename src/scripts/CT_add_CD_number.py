import json
from shapely.geometry import shape

with open("CT_precinct_race_income_with_districts.geojson", "r") as file:
    full_data = json.load(file)

precincts = full_data["features"]["precincts"]
districts = full_data["features"]["districts"]

district_geometries = {}
for district in districts:
    district_id = district['id']
    district_geom = shape(district['geometry'])
    district_geometries[district_id] = district_geom

#Iterate through precincts and assign the correct district
for precinct in precincts:
    precinct_geom = shape(precinct['geometry'])
    
    for district_id, district_geom in district_geometries.items():
        if precinct_geom.within(district_geom):
            # Assign the congressional district to the precinct
            precinct['properties']['CONG_DIST'] = district_id
            break

with open('CT_FINAL.geojson', 'w') as f:
    json.dump(full_data, f, indent=4)

print("GeoJSON updated successfully.")
