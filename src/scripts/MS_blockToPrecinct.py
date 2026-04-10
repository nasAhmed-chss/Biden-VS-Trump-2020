import geopandas as gpd
import pandas as pd

precinct_data = gpd.read_file('ms precinct with CD connection.geojson')
block_data = gpd.read_file('ms_race_2022_bg/ms_race_2022_bg.shp')
income_data = gpd.read_file('ms_inc_2022_bg/ms_inc_2022_bg.shp')

block_data = block_data.rename(columns={'GEOID': 'GEOID20'})

if block_data.crs != precinct_data.crs:
    block_data = block_data.to_crs(precinct_data.crs)

# Perform a spatial join to map block race data to the precincts
joined_data = gpd.sjoin(block_data, precinct_data, how="left", predicate="intersects")

# Aggregate race data to the precinct level
race_columns = ['TOT_POP22', 'WHT_NHSP22', 'BLK_NHSP22', 'HSP_POP22', 'ASN_NHSP22', 'OTH_NHSP22']
agg_race_data = joined_data.groupby('GEOID20_right')[race_columns].sum()

# Merge aggregated race data back into the precinct GeoDataFrame
precinct_data = precinct_data.merge(agg_race_data, left_on='GEOID20', right_index=True, how='left')

if income_data.crs != precinct_data.crs:
    income_data = income_data.to_crs(precinct_data.crs)

# Perform a spatial join to map income data to the precincts
income_joined = gpd.sjoin(precinct_data, income_data, how="left", predicate="intersects")

income_columns = [
    'TOT_HOUS22', 'LESS_10K22', '10K_15K22', '15K_20K22', '20K_25K22',
    '25K_30K22', '30K_35K22', '35K_40K22', '40K_45K22', '45K_50K22',
    '50K_60K22', '60K_75K22', '75K_100K22', '100_125K22', '125_150K22',
    '150_200K22', '200K_MOR22'
]

agg_income_data = income_joined.groupby('GEOID20')[income_columns].sum()

# Compute the median income for each precinct
median_incomes = (
    income_joined.groupby('GEOID20')['MEDN_INC22']
    .apply(lambda x: x.median() if not x.isna().all() else None)  
)


# Merge both summed and median data into the precinct GeoDataFrame
precinct_data = precinct_data.merge(agg_income_data, left_on='GEOID20', right_index=True, how='left')
precinct_data = precinct_data.merge(median_incomes.rename('MEDN_INC22'), left_on='GEOID20', right_index=True, how='left')

precinct_data.to_file('MS_precinct_race_income_data.geojson', driver='GeoJSON')

print("Successfully aggregated race and income data for precincts!")
