import geopandas as gpd
import pandas as pd

precinct_data = gpd.read_file('CT_precinctAndVotingData.geojson')
block_data = gpd.read_file('ct_race_2022_bg/ct_race_2022_bg.shp')  

income_data = gpd.read_file('ct_inc_2022_bg/ct_inc_2022_bg.shp')  

if block_data.crs != precinct_data.crs:
    block_data = block_data.to_crs(precinct_data.crs)

if income_data.crs != precinct_data.crs:
    income_data = income_data.to_crs(precinct_data.crs)

# Perform a spatial join based on geometry (blocks that intersect with precincts) for race data
joined_race_data = gpd.sjoin(block_data, precinct_data, how="left", predicate="intersects")

# Aggregate the race data by precinct 
race_columns = ['TOT_POP22', 'WHT_NHSP22', 'BLK_NHSP22', 'HSP_POP22', 'ASN_NHSP22', 'OTH_NHSP22']
agg_race_data = joined_race_data.groupby('NAME20')[race_columns].sum()  

# Perform a spatial join based on geometry (blocks that intersect with precincts) for income data
joined_income_data = gpd.sjoin(income_data, precinct_data, how="left", predicate="intersects")

# Handle median calculation for income
def compute_median(series):
    """Custom aggregation function to calculate median, excluding None values."""
    valid_values = series.dropna()  # Drop NaN values
    return valid_values.median() if not valid_values.empty else None

income_columns_to_sum = [
    'TOT_HOUS22', 'LESS_10K22', '10K_15K22', '15K_20K22', '20K_25K22',
    '25K_30K22', '30K_35K22', '35K_40K22', '40K_45K22', '45K_50K22', '50K_60K22',
    '60K_75K22', '75K_100K22', '100_125K22', '125_150K22', '150_200K22', '200K_MOR22'
]

agg_income_data = joined_income_data.groupby('NAME20').agg(
    {**{col: 'sum' for col in income_columns_to_sum}, 'MEDN_INC22': compute_median}
)

# Merge the aggregated race data and income data into the precinct data GeoDataFrame
precinct_data = precinct_data.merge(agg_race_data, left_on='NAME20', right_index=True, how='left')
precinct_data = precinct_data.merge(agg_income_data, left_on='NAME20', right_index=True, how='left')

precinct_data.to_file('CT_precinct_race_income_data.geojson', driver='GeoJSON')

