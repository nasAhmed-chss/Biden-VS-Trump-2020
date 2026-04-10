const { MongoClient } = require('mongodb');
const fs = require('fs');

async function main() {
    const uri = "mongodb://127.0.0.1:27017";
    const client = new MongoClient(uri);

    try {
        await client.connect();

        const database = client.db("416_Project_Data");

        const stateBordersCollection = database.collection("stateBorders");
        const stateBordersData = fs.readFileSync('public/data/state_borders.json', 'utf8');
        const stateBordersJsonData = JSON.parse(stateBordersData);
        const stateBordersResult = await stateBordersCollection.insertMany(stateBordersJsonData.features);
        console.log(`${stateBordersResult.insertedCount} documents inserted into the stateBorders collection.`);

        const CTvotingDataCollection = database.collection("connecticutVotingData");
        const CTvotingData = fs.readFileSync('public/data/connecticut_voting_data.json', 'utf8');
        const CTvotingJsonData = JSON.parse(CTvotingData);
        const CTvotingDataResult = await CTvotingDataCollection.insertMany(CTvotingJsonData);
        console.log(`${CTvotingDataResult.insertedCount} documents inserted into the connecticutVotingData collection.`);

        const CTincomeDataCollection = database.collection("connecticut_income_data");
        const CTincomeData = fs.readFileSync('public/data/connecticut_income_data.json', 'utf8');
        const CTincomeJsonData = JSON.parse(CTincomeData);
        const CTincomeDataResult = await CTincomeDataCollection.insertMany(CTincomeJsonData);
        console.log(`${CTincomeDataResult.insertedCount} documents inserted into the connecticutVotingData collection.`);

        const CTraceDataCollection = database.collection("connecticut_race_data");
        const CTraceData = fs.readFileSync('public/data/connecticut_race_data.json', 'utf8');
        const CTraceJsonData = JSON.parse(CTraceData);
        const CTraceDataResult = await CTraceDataCollection.insertMany(CTraceJsonData);
        console.log(`${CTraceDataResult.insertedCount} documents inserted into the connecticutVotingData collection.`);

    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

main().catch(console.error);
