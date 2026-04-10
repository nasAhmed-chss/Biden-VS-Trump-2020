import json
import os
import numpy as np
from scipy.stats import gaussian_kde

def process_state(file_name, state_label, low_income_threshold, high_income_threshold):
    # Step 1: Load the data from the local GeoJSON file
    file_path = os.path.join(os.path.dirname(__file__), file_name)

    # Check if the file exists
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"GeoJSON file not found at {file_path}")

    # Load GeoJSON data
    with open(file_path, "r", encoding="utf-8") as file:
        geojson_data = json.load(file)

    # Access the 'precincts' under 'features'
    data = geojson_data['features']['precincts']

    # Limit to 100 precincts
    data = data[:100]

    grouped_support = {
        "Trump": {
            "Low Income": [],
            "Middle Income": [],
            "High Income": []
        },
        "Biden": {
            "Low Income": [],
            "Middle Income": [],
            "High Income": []
        }
    }

    # Step 2: Process data
    for precinct in data:
        properties = precinct['properties']

        # Calculate total votes cast
        total_votes_cast = (
            properties.get('G20PREDBID', 0) +
            properties.get('G20PRERTRU', 0) +
            properties.get('G20PRELJOR', 0) +
            properties.get('G20PREGHAW', 0) +
            properties.get('G20PREOWRI', 0)
        )

        if total_votes_cast == 0:
            continue  # Skip precincts with no votes

        # Normalize Trump and Biden votes
        trump_support_fraction = properties.get('G20PRERTRU', 0) / total_votes_cast
        biden_support_fraction = properties.get('G20PREDBID', 0) / total_votes_cast

        # Categorize precincts into income groups based on median income
        median_income = properties.get('MEDN_INC22', 0)
        if median_income <= low_income_threshold:
            grouped_support["Trump"]["Low Income"].append(trump_support_fraction)
            grouped_support["Biden"]["Low Income"].append(biden_support_fraction)
        elif median_income <= high_income_threshold:
            grouped_support["Trump"]["Middle Income"].append(trump_support_fraction)
            grouped_support["Biden"]["Middle Income"].append(biden_support_fraction)
        else:
            grouped_support["Trump"]["High Income"].append(trump_support_fraction)
            grouped_support["Biden"]["High Income"].append(biden_support_fraction)

    # Step 3: Estimate density for each income group
    def estimate_density(support_array):
        if len(support_array) == 0:
            return []  # Handle cases where no data is available
        kde = gaussian_kde(support_array, bw_method='scott')  # Kernel Density Estimation
        x = np.linspace(0, 1, 100)  # Support fraction from 0 to 1
        y = kde(x)
        return [{"x": round(xi, 2), "density": round(yi, 4)} for xi, yi in zip(x, y)]

    density_data = {
        state_label: {
            candidate: {
                income_group: estimate_density(supports)
                for income_group, supports in income_groups.items()
            }
            for candidate, income_groups in grouped_support.items()
        }
    }

    return density_data


# Process Connecticut
connecticut_data = process_state(
    file_name="Connecticut_Master_Data.geojson",
    state_label="Connecticut",
    low_income_threshold=80000,
    high_income_threshold=160000
)

# Process Mississippi
mississippi_data = process_state(
    file_name="Mississippi_Master_Data.geojson",
    state_label="Mississippi",
    low_income_threshold=42073.50,
    high_income_threshold=61121.25
)

# Combine data for both states
combined_data = {**connecticut_data, **mississippi_data}

# Save combined output to a JSON file
output_file = "income_support_density_by_state.json"
with open(output_file, "w") as f:
    json.dump(combined_data, f, indent=4)

print(f"Density data saved to '{output_file}'")
