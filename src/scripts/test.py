import json
import os
import numpy as np

# Path to Mississippi's GeoJSON file
file_path = os.path.join(os.path.dirname(__file__), "Connecticut_Master_Data.geojson")

# Check if the file exists
if not os.path.exists(file_path):
    raise FileNotFoundError(f"GeoJSON file not found at {file_path}")

# Load GeoJSON data
with open(file_path, "r", encoding="utf-8") as file:
    geojson_data = json.load(file)

# Access the 'precincts' under 'features'
precincts = geojson_data['features']['precincts']

# Save all median incomes into an array
median_incomes = []
for precinct in precincts:
    properties = precinct['properties']
    median_income = properties.get('MEDN_INC22', None)  # Get the median income
    if median_income is not None:
        median_incomes.append(median_income)

# Convert the list to a numpy array
median_incomes_array = np.array(median_incomes)

# Calculate percentiles
min_income = np.min(median_incomes_array)
percentile_25 = np.percentile(median_incomes_array, 25)  # 25th percentile
median_income = np.median(median_incomes_array)          # Median (50th percentile)
percentile_75 = np.percentile(median_incomes_array, 75)  # 75th percentile
max_income = np.max(median_incomes_array)

# Print results
print(f"Number of Precincts: {len(median_incomes)}")
print(f"Minimum Income: ${min_income:,.2f}")
print(f"25th Percentile (Low Income Threshold): ${percentile_25:,.2f}")
print(f"Median Income: ${median_income:,.2f}")
print(f"75th Percentile (High Income Threshold): ${percentile_75:,.2f}")
print(f"Maximum Income: ${max_income:,.2f}")
