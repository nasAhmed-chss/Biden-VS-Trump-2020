import geopandas as gpd
import json

# Load the GeoJSON file
with open("MS_final_districts.geojson", "r") as file:
    data = json.load(file)

# Extract precincts and districts
precinct_features = data["features"]["precincts"]
district_features = data["features"]["districts"]

# Convert to GeoDataFrames
precinct_gdf = gpd.GeoDataFrame.from_features(precinct_features, crs="EPSG:4269")
district_gdf = gpd.GeoDataFrame.from_features(district_features, crs="EPSG:4269")

# Convert CRS to calculate areas in meters (EPSG:3857) and then to square kilometers
precinct_gdf = precinct_gdf.to_crs("EPSG:3857")
district_gdf = district_gdf.to_crs("EPSG:3857")

# Calculate area in square kilometers
precinct_gdf["area_km2"] = precinct_gdf.geometry.area / 1e6
district_gdf["area_km2"] = district_gdf.geometry.area / 1e6

# Calculate population density
precinct_gdf["pop_density"] = precinct_gdf["TOT_POP22"] / precinct_gdf["area_km2"]
district_gdf["pop_density"] = district_gdf["TOT_POP22"] / district_gdf["area_km2"]

# Categorize as Rural, Urban, or Suburban based on population density
def categorize_density(density):
    if density < 100:  # Less than 100 people per km² is Rural
        return "Rural"
    elif density < 1000:  # 100-1000 people per km² is Suburban
        return "Suburban"
    else:  # More than 1000 people per km² is Urban
        return "Urban"

precinct_gdf["category"] = precinct_gdf["pop_density"].apply(categorize_density)
district_gdf["category"] = district_gdf["pop_density"].apply(categorize_density)

# Update the GeoJSON features with population density and category
for feature, row in zip(precinct_features, precinct_gdf.itertuples()):
    feature["properties"]["pop_density"] = row.pop_density
    feature["properties"]["category"] = row.category

for feature, row in zip(district_features, district_gdf.itertuples()):
    feature["properties"]["pop_density"] = row.pop_density
    feature["properties"]["category"] = row.category

# Write the updated GeoJSON back to file with pretty formatting
updated_data = {
    "type": data["type"],
    "name": data["name"],
    "crs": data["crs"],
    "features": {
        "precincts": precinct_features,
        "districts": district_features,
    },
}


with open("MS_popdensity.geojson", "w") as outfile:
    json.dump(updated_data, outfile, indent=4)


# Validate and summarize the result
print(f"Total precincts processed: {len(precinct_features)}")
print(f"Total districts processed: {len(district_features)}")
print("Population density and categories have been added to all precincts and districts!")
