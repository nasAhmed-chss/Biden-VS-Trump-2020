import json
import statistics

FIELDS_TO_SUM = [
    "TOT_POP22", "WHT_NHSP22", "BLK_NHSP22", "HSP_POP22", "ASN_NHSP22", 
    "OTH_NHSP22", "TOT_HOUS22", "LESS_10K22", "10K_15K22", "15K_20K22",
    "20K_25K22", "25K_30K22", "30K_35K22", "35K_40K22", "40K_45K22", 
    "45K_50K22", "50K_60K22", "60K_75K22", "75K_100K22", "100_125K22", 
    "125_150K22", "150_200K22", "200K_MOR22", "G20PRERTRU", "G20PREDBID", 
    "G20PRELJOR", "G20PREGHAW", "G20PREABLA", "G20PREOCAR", "G20PREIWES", 
    "G20PREICOL", "G20PREIPIE", "G20USSRHYD", "G20USSDESP", "G20USSLEDW"
]

FIELD_TO_MEDIAN = "MEDN_INC22"

with open("ms_final_updated.geojson", "r") as file:
    ms_final = json.load(file)

districts_data = {
    district["properties"]["District"]: {
        "sums": {field: 0 for field in FIELDS_TO_SUM},
        "median_incomes": []
    }
    for district in ms_final["features"]["districts"]
}

for precinct in ms_final["features"]["precincts"]:
    district_id = int(precinct["properties"]["CONG_DIST"])
    district_entry = districts_data[district_id]
    
    for field in FIELDS_TO_SUM:
        district_entry["sums"][field] += precinct["properties"].get(field, 0)
    
    median_income = precinct["properties"].get(FIELD_TO_MEDIAN)
    if median_income is not None and median_income > 0:  
        district_entry["median_incomes"].append(median_income)

# Update the district properties with the aggregated data
for district in ms_final["features"]["districts"]:
    district_id = district["properties"]["District"]
    district_entry = districts_data[district_id]
    
    for field, total in district_entry["sums"].items():
        district["properties"][field] = total
    
    incomes = district_entry["median_incomes"]
    if incomes:
        district["properties"][FIELD_TO_MEDIAN] = round(statistics.median(incomes))
    else:
        district["properties"][FIELD_TO_MEDIAN] = None  # Handle edge case

with open("ms_final_districts.geojson", "w") as updated_file:
    json.dump(ms_final, updated_file, indent=4)

