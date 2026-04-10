import json
from functools import partial
from gerrychain import Graph, Partition, MarkovChain
from gerrychain.proposals import recom
from gerrychain.constraints import within_percent_of_ideal_population, contiguous
from gerrychain.accept import always_accept
from gerrychain.updaters import Tally, cut_edges
import tempfile
import os
import geopandas as gpd
import io


GEOJSON_FILE = "MS_ABSOLUTE_FINAL.geojson"
POP_COLUMN = "TOT_POP22"
DISTRICT_COLUMN = "CONG_DIST"
NUM_TEST_PLANS = 250
NUM_LARGE_PLANS = 5000
EPSILON = 0.05  # Allowable population deviation
NODE_REPEATS = 10  # Number of times to try reassigning nodes

def load_geojson(file_path):
    with open(file_path, 'r') as f:
        geojson_data = json.load(f)

    print(f"Loaded GeoJSON data type: {type(geojson_data)}")
    print(f"GeoJSON data keys: {geojson_data.keys()}")

    if "features" not in geojson_data:
        raise ValueError("GeoJSON file does not contain 'features' key")

    features = geojson_data["features"]

    if isinstance(features, dict):
        print(f"Features dictionary keys: {features.keys()}")
        if 'precincts' in features:
            print(f"'precincts' contains {len(features['precincts'])} items")
            features = features['precincts']  
        elif 'districts' in features:
            print(f"'districts' contains {len(features['districts'])} items")
            features = features['districts']  
        else:
            raise ValueError("The 'features' key contains an unexpected structure")

    if not isinstance(features, list):
        raise ValueError("'features' key does not contain a list")

    print(f"First few features (limit to 3 items):")
    for i, feature in enumerate(features[:3]):
        print(f"Feature {i + 1}: {feature}")  

    print("Keys of the first 3 features:")
    for i, feature in enumerate(features[:3]):
        print(f"Feature {i + 1} keys: {list(feature.keys())}")

    gdf = gpd.GeoDataFrame.from_features(features)

    gdf['geometry'] = gdf['geometry'].buffer(0)

    # Create a BytesIO instance and save the GeoDataFrame to it
    geojson_bytes = io.BytesIO()
    gdf.to_file(geojson_bytes, driver="GeoJSON")
    geojson_bytes.seek(0)  # Reset pointer to the beginning of the BytesIO instance

    # Create the graph from the BytesIO instance
    graph = Graph.from_file(geojson_bytes)

    districts = set(gdf["CONG_DIST"])
    num_districts = len(districts)

    return graph, num_districts

def create_chain(graph, num_districts, total_steps):
    total_population = sum(data[POP_COLUMN] for _, data in graph.nodes(data=True))
    ideal_population = total_population / num_districts
    
    partition = Partition(
        graph,
        assignment=DISTRICT_COLUMN,  
        updaters={
            "population": Tally(POP_COLUMN, alias="population"),
            "cut_edges": cut_edges,
        },
    )
    
    constraints = [
        within_percent_of_ideal_population(ideal_population, EPSILON),
        contiguous,
    ]
    
    proposal = partial(
        recom, pop_col=POP_COLUMN, pop_target=ideal_population, epsilon=EPSILON, node_repeats=NODE_REPEATS
    )
    
    chain = MarkovChain(
        proposal=proposal,
        constraints=constraints,
        accept=always_accept,
        initial_state=partition,
        total_steps=total_steps,
    )
    
    return chain

def save_plans(chain, output_file):
    plans = [dict(partition.assignment) for partition in chain]
    with open(output_file, "w") as f:
        json.dump(plans, f, indent=2)

def main():
    graph, num_districts = load_geojson(GEOJSON_FILE)
    print(f"Loaded graph with {num_districts} districts.")
    
    print("Generating test ensemble...")
    test_chain = create_chain(graph, num_districts, NUM_TEST_PLANS)
    save_plans(test_chain, "test_ensemble.json")
    print("Test ensemble saved as 'test_ensemble.json'")
    
    print("Generating large ensemble...")
    large_chain = create_chain(graph, num_districts, NUM_LARGE_PLANS)
    save_plans(large_chain, "large_ensemble.json")
    print("Large ensemble saved as 'large_ensemble.json'")

if __name__ == "__main__":
    main()
