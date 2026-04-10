import json

FIELDS_TO_REMOVE = [
    "GCON01DELI", "GCON01RKEL", "GCON02RFLO", 
    "GCON02DTHO", "GCON03DBEN", "GCON03RGUE", 
    "GCON04RPAL"
]

with open("ms_final.geojson", "r") as ms_final_file:
    ms_final = json.load(ms_final_file)

with open("MS_precinctAndVotingData.geojson", "r") as voting_data_file:
    voting_data = json.load(voting_data_file)

voting_data_lookup = {
    feature["properties"]["GEOID20"]: feature["properties"]
    for feature in voting_data["features"]
}

for precinct in ms_final["features"]["precincts"]:
    geoid = precinct["properties"]["GEOID20"]
    if geoid in voting_data_lookup:
        voting_properties = voting_data_lookup[geoid]
        for key, value in voting_properties.items():
            if key not in precinct["properties"]:  
                precinct["properties"][key] = value

    for field in FIELDS_TO_REMOVE:
        precinct["properties"].pop(field, None)

with open("ms_final_updated.geojson", "w") as updated_file:
    json.dump(ms_final, updated_file, indent=4)

print("Data merged and fields removed successfully! The updated file is 'ms_final_updated.json'.")
