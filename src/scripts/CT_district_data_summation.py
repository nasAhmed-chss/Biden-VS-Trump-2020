import json
from shapely.geometry import shape
from shapely.ops import unary_union
import statistics

# Load the Connecticut file
with open("CT_FINAL.geojson", "r") as file:
    ct_final = json.load(file)

# Check the overall structure of the GeoJSON file
print("GeoJSON structure:")
print(type(ct_final))  # Print the type of the loaded object (should be dict)
print("Keys in the GeoJSON structure:", ct_final.keys())  # Check the keys

# Check if 'features' contains 'precincts' and 'districts'
if "features" in ct_final:
    features = ct_final["features"]
    print(f"Features data type: {type(features)}")  # Check the type of features
    
    if "districts" in features:
        districts = features["districts"]
        print(f"'districts' key found. Number of districts: {len(districts)}")

        # Create a dictionary to store aggregated data for each district
        district_data = {district['id']: {'precincts': [], 'median_incomes': []} for district in districts}

        # Convert each district's geometry to a shapely object for spatial comparison
        district_geometries = {district['id']: shape(district['geometry']) for district in districts}

        if "precincts" in features:
            precincts = features["precincts"]
            print(f"'precincts' key found. Number of precincts: {len(precincts)}")

            # Process precincts and match them to districts
            for precinct in precincts:
                # Convert precinct geometry to shapely object
                precinct_geometry = shape(precinct['geometry'])

                # Check which district(s) the precinct belongs to by checking spatial containment
                for district_id, district_geometry in district_geometries.items():
                    if district_geometry.contains(precinct_geometry):
                        # Collect relevant data from the precinct
                        district_data[district_id]['precincts'].append(precinct['properties'])
                        district_data[district_id]['median_incomes'].append(precinct['properties'].get('MEDN_INC22', 0))

            # Now, update the districts with aggregated data
            for district in districts:
                district_id = district['id']
                if district_id in district_data:
                    # Aggregate the total population, housing, race, etc., by summing the values for each district
                    aggregated_data = {}
                    for key in ['G20PREDBID', 'G20PRERTRU', 'G20PRELJOR', 'G20PREGHAW', 'G20PREOWRI',
                                'TOT_POP22', 'WHT_NHSP22', 'BLK_NHSP22', 'HSP_POP22', 'ASN_NHSP22', 'OTH_NHSP22',
                                'TOT_HOUS22', 'LESS_10K22', '10K_15K22', '15K_20K22', '20K_25K22', '25K_30K22', 
                                '30K_35K22', '35K_40K22', '40K_45K22', '45K_50K22', '50K_60K22', '60K_75K22', 
                                '75K_100K22', '100_125K22', '125_150K22', '150_200K22', '200K_MOR22']:
                        aggregated_data[key] = sum([precinct.get(key, 0) for precinct in district_data[district_id]['precincts']])

                    # Add the aggregated data back into the district's properties
                    district['properties'].update(aggregated_data)

                    # Calculate the median of all the median incomes in the district
                    median_incomes = district_data[district_id]['median_incomes']
                    if median_incomes:
                        district['properties']['MEDN_INC22'] = statistics.median(median_incomes)
                    else:
                        district['properties']['MEDN_INC22'] = None

            # Save the updated GeoJSON with aggregated data
            with open("CT_FINAL_with_aggregated_data.geojson", "w") as output_file:
                json.dump(ct_final, output_file, indent=4)
            print("GeoJSON saved with aggregated data.")

else:
    print("'features' key is missing or not as expected.")
