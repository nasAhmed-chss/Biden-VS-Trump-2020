import json
import numpy as np
import matplotlib.pyplot as plt
from scipy.stats import gaussian_kde

# Define general voting trends for each racial group
MS_trends = {
    "White": {"Trump": 0.75, "Biden": 0.25},      # High Trump support among White voters
    "Black": {"Trump": 0.10, "Biden": 0.90},      # Overwhelming Biden support among Black voters
    "Hispanic": {"Trump": 0.40, "Biden": 0.60},   # Mixed, slight Biden leaning
    "Asian": {"Trump": 0.35, "Biden": 0.65},      # Moderate Biden leaning
    "Other": {"Trump": 0.45, "Biden": 0.55}       # Mixed support
}
CT_trends = {
    "White": {"Trump": 0.45, "Biden": 0.55},      # Moderate Trump support among White voters
    "Black": {"Trump": 0.12, "Biden": 0.88},      # Strong Biden support among Black voters
    "Hispanic": {"Trump": 0.35, "Biden": 0.65},   # Moderate Biden leaning
    "Asian": {"Trump": 0.25, "Biden": 0.75},      # Strong Biden preference
    "Other": {"Trump": 0.40, "Biden": 0.60}       # Mixed, slight Biden leaning
}


# Function to generate smooth density data
def generate_kde_density(mean_support, size=1000, variance=0.02, bw_adjust=0.05):
    """
    Generate KDE-based density data with flexibility for smoothness.
    - mean_support: Center point for the support.
    - variance: Spread of the support values around the mean.
    - bw_adjust: Adjusts the bandwidth for KDE (higher = smoother, lower = sharper).
    """
    # Generate support data with some spread
    support_data = np.random.normal(loc=mean_support, scale=variance, size=size)
    support_data = np.clip(support_data, 0, 1)  # Keep support data within [0, 1]
    
    # Apply Gaussian KDE to estimate density
    kde = gaussian_kde(support_data, bw_method=bw_adjust)
    x = np.linspace(0, 1, 200)
    y = kde(x)

    return [{"x": round(float(xi), 2), "density": round(float(yi), 4)} for xi, yi in zip(x, y)]


# Function to generate support data for a state using respective trends
def generate_state_data(state_name, trends):
    state_data = {
        state_name: {
            "Trump": {},
            "Biden": {}
        }
    }
    for race, support in trends.items():
        # Adjust variance and bandwidth for smoother, less polarized peaks
        state_data[state_name]["Trump"][race] = generate_kde_density(
            mean_support=support["Trump"], variance=0.03, bw_adjust=0.1)
        state_data[state_name]["Biden"][race] = generate_kde_density(
            mean_support=support["Biden"], variance=0.02, bw_adjust=0.1)
    return state_data


# Generate data for Connecticut and Mississippi using their respective trends
ct_data = generate_state_data("Connecticut", CT_trends)
ms_data = generate_state_data("Mississippi", MS_trends)

# Combine into one structure
combined_data = {**ct_data, **ms_data}

# Save to a JSON file
output_file = "smooth_racial_support_density.json"
with open(output_file, "w") as file:
    json.dump(combined_data, file, indent=4)

print(f"Smooth racial support density data saved to {output_file}")
