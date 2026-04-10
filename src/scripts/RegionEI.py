import json
import numpy as np
from scipy.stats import gaussian_kde
import matplotlib.pyplot as plt

# General trends for Urban, Suburban, and Rural
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
# Function to generate smooth KDE density data with variation
def generate_kde_density(mean_support, size=3000, variance_range=(0.01, 0.05), bw_adjust_range=(0.2, 0.3)):
    """
    Generate KDE-based smooth density data with variation.
    - mean_support: Center point for the support (fraction 0-1).
    - size: Sample size for KDE estimation.
    - variance_range: Range of variance to randomize spread.
    - bw_adjust_range: Bandwidth adjustment for KDE smoothness.
    """
    # Randomize variance and bandwidth
    variance = np.random.uniform(*variance_range)
    bw_adjust = np.random.uniform(*bw_adjust_range)

    # Generate support data with variance and clip within [0, 1]
    support_data = np.random.normal(loc=mean_support, scale=variance, size=size)
    support_data = np.clip(support_data, 0, 1)

    # Apply Gaussian KDE with adjusted smoothness
    kde = gaussian_kde(support_data, bw_method=bw_adjust)
    x = np.linspace(0, 1, 300)  # Smooth X-axis range
    y = kde(x)

    return [{"x": round(float(xi), 3), "density": round(float(yi), 4)} for xi, yi in zip(x, y)]

# Function to generate data for a state with respective trends
def generate_state_data(state_name, trends):
    state_data = {
        state_name: {
            "Trump": {},
            "Biden": {}
        }
    }
    for region, support in trends.items():
        # Generate smooth densities with variation
        state_data[state_name]["Trump"][region] = generate_kde_density(
            mean_support=support["Trump"], variance_range=(0.02, 0.04), bw_adjust_range=(0.2, 0.3)
        )
        state_data[state_name]["Biden"][region] = generate_kde_density(
            mean_support=support["Biden"], variance_range=(0.01, 0.03), bw_adjust_range=(0.2, 0.3)
        )
    return state_data

# Generate data for Connecticut and Mississippi using their trends
ct_data = generate_state_data("Connecticut", CT_trends)
ms_data = generate_state_data("Mississippi", MS_trends)

# Combine data and save to JSON
combined_data = {**ct_data, **ms_data}

output_file = "smooth_income_density.json"
with open(output_file, "w") as file:
    json.dump(combined_data, file, indent=4)

print(f"Smooth mock density data saved to {output_file}")

# Quick Visualization (optional testing)
def plot_density(data, title):
    plt.figure(figsize=(10, 6))
    for region, values in data.items():
        x = [point['x'] for point in values]
        y = [point['density'] for point in values]
        plt.plot(x, y, label=region)
    plt.title(title)
    plt.xlabel("Support Fraction")
    plt.ylabel("Density")
    plt.legend()
    plt.show()

# Test visualization for Connecticut Biden data
plot_density(ct_data["Connecticut"]["Biden"], "Smooth Support for Biden by Income Group")
plot_density(ct_data["Connecticut"]["Trump"], "Smooth Support for Trump by Income Group")
