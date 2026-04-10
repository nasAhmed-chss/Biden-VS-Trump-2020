package projectbackend.controllers;

import java.io.ByteArrayOutputStream;
import java.io.BufferedReader;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.data.mongodb.core.convert.MappingMongoConverter;
import org.springframework.data.mongodb.core.query.Query;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.gridfs.GridFSBucket;
import com.mongodb.client.gridfs.GridFSBuckets;
import com.mongodb.client.gridfs.model.GridFSFile;
import com.mongodb.client.gridfs.GridFSDownloadStream;

import projectbackend.db.MongoDBConnection;

import com.mongodb.client.gridfs.model.GridFSFile;
import org.springframework.data.mongodb.core.query.Criteria;

@RestController
@RequestMapping("/api/data")
public class DataController {

    @Autowired
    private MongoDBConnection mongoDBConnection;

    @Autowired
    private GridFsTemplate gridFsTemplate;

    @GetMapping("/testing")
    public List<Document> getCT_voteing_data() {
        MongoCollection<Document> collection = mongoDBConnection.getDatabase().getCollection("testing");
        List<Document> stateData = new ArrayList<>();
        for (Document doc : collection.find()) {
            stateData.add(doc);
        }
        return stateData;
    }

    // private final ConcurrentHashMap<String, String> fileCache = new
    // ConcurrentHashMap<>();

    // @GetMapping(value = "/{state}/Master_Data_Grid", produces =
    // "application/json")
    // public ResponseEntity<String> getFileByStateWithCache(@PathVariable("state")
    // String state) {
    // String fileName = state + "_ABSOLUTE_FINAL.geojson";

    // try {
    // // Check the cache first
    // if (fileCache.containsKey(fileName)) {
    // return ResponseEntity.ok(fileCache.get(fileName));
    // }

    // // Create a GridFS bucket
    // GridFSBucket gridFSBucket =
    // GridFSBuckets.create(mongoDBConnection.getDatabase());

    // // Find the file in GridFS
    // GridFSFile gridFSFile = gridFSBucket.find(new org.bson.Document("filename",
    // fileName)).first();
    // if (gridFSFile == null) {
    // return ResponseEntity.status(HttpStatus.NOT_FOUND).body("File not found: " +
    // fileName);
    // }

    // // Download the file content
    // GridFSDownloadStream downloadStream =
    // gridFSBucket.openDownloadStream(gridFSFile.getObjectId());
    // ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
    // byte[] buffer = new byte[1024];
    // int bytesRead;

    // while ((bytesRead = downloadStream.read(buffer)) != -1) {
    // outputStream.write(buffer, 0, bytesRead);
    // }
    // downloadStream.close();

    // // Convert the content to a UTF-8 encoded string
    // String fileContent = outputStream.toString("UTF-8");

    // // Cache the file content
    // fileCache.put(fileName, fileContent);

    // // Return the file content
    // return ResponseEntity.ok(fileContent);
    // } catch (Exception e) {
    // e.printStackTrace();
    // return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
    // .body("An error occurred while retrieving the file: " + e.getMessage());
    // }
    // }

    @GetMapping(value = "/state_borders", produces = "application/json")
    public List<Document> getStateBorders() {
        MongoCollection<Document> collection = mongoDBConnection.getDatabase().getCollection("state_borders");
        List<Document> stateData = new ArrayList<>();
        for (Document doc : collection.find()) {
            stateData.add(doc);
        }
        return stateData;
    }

    @GetMapping(value = "/{state}/Master_Data", produces = "application/json")
    public String getMasterData(@PathVariable("state") String state) throws IOException {
        String filePath = "data/" + state + "_Master_Data.geojson";
        return filePath;
    }

    @GetMapping(value = "/connecticut_income_data", produces = "application/json")
    public String getConnecticutIncomeData() throws IOException {
        String filePath = "../public/data/connecticut_income_data.json";
        return new String(Files.readAllBytes(Paths.get(filePath)));
    }

    @GetMapping(value = "/CT_voting_data", produces = "application/json")
    public String getCT_voting_data() throws IOException {
        String filePath = "../public/data/connecticut_voting_data.json";
        return new String(Files.readAllBytes(Paths.get(filePath)));
    }

    @GetMapping(value = "/connecticut_race_data", produces = "application/json")
    public String getCT_race_data() throws IOException {
        String filePath = "../public/data/connecticut_race_data.json";
        return new String(Files.readAllBytes(Paths.get(filePath)));
    }

    @GetMapping(value = "/CT_RaceVotesBreakdown", produces = "application/json")
    public String getCT_raceVotes_data() throws IOException {
        String filePath = "../public/data/CT_RaceVotesBreakdown.json";
        return new String(Files.readAllBytes(Paths.get(filePath)));
    }

    @GetMapping(value = "/MS_RaceVotesBreakdown", produces = "application/json")
    public String getMS_raceVotes_data() throws IOException {
        String filePath = "../public/data/MS_RaceVotesBreakdown.json";
        return new String(Files.readAllBytes(Paths.get(filePath)));
    }

    @GetMapping(value = "/CT_RaceVSIncome", produces = "application/json")
    public String getCT_raceIncome_data() throws IOException {
        String filePath = "../public/data/CT_RaceVSIncome.json";
        return new String(Files.readAllBytes(Paths.get(filePath)));
    }

    @GetMapping(value = "/MS_RaceVSIncome", produces = "application/json")
    public String getMS_raceIncome_data() throws IOException {
        String filePath = "../public/data/MS_RaceVSIncome.json";
        return new String(Files.readAllBytes(Paths.get(filePath)));
    }

    @GetMapping(value = "/IncomeEcologicalInferenceData", produces = "application/json")
    public String getCT_EcologicalInferenceData() throws IOException {
        String filePath = "../public/data/IncomeEcologicalInferenceData.json";
        return new String(Files.readAllBytes(Paths.get(filePath)));
    }

    @GetMapping(value = "/mississippi_income_data", produces = "application/json")
    public String getMississippiIncomeData() throws IOException {
        String filePath = "../public/data/mississippi_income_data.json";
        return new String(Files.readAllBytes(Paths.get(filePath)));
    }

    @GetMapping(value = "/mississippi_race_data", produces = "application/json")
    public String getMS_race_data() throws IOException {
        String filePath = "../public/data/mississippi_race_data.json";
        return new String(Files.readAllBytes(Paths.get(filePath)));
    }

    @GetMapping(value = "/MS_voting_data", produces = "application/json")
    public String getMS_voting_data() throws IOException {
        String filePath = "../public/data/mississippi_voting_data.json";
        return new String(Files.readAllBytes(Paths.get(filePath)));
    }

    @GetMapping(value = "/MS_Ensemble_Data", produces = "application/json")
    public String getMS_ensemble_data() throws IOException {
        String filePath = "../public/data/MS_Ensemble_Data.json";
        return new String(Files.readAllBytes(Paths.get(filePath)));
    }

    @GetMapping(value = "/state-overview-data", produces = "application/json")
    public String getStateOverviewData() throws IOException {
        String filePath = "../public/data/stateOverview_data.json";
        return new String(Files.readAllBytes(Paths.get(filePath)));
    }

    @GetMapping(value = "/CongressionalRepresentation", produces = "application/json")
    public String getCongressionalRepresentationData() throws IOException {
        String filePath = "../public/data/CongressionalRepresentation.json";
        return new String(Files.readAllBytes(Paths.get(filePath)));
    }

    @GetMapping(value = "/CT_Representation", produces = "application/json")
    public String getConnecticutRepresentationData() throws IOException {
        String filePath = "../public/data/CT_Representation.json";
        return new String(Files.readAllBytes(Paths.get(filePath)));
    }

    @GetMapping(value = "/MS_Representation", produces = "application/json")
    public String getMississippiRepresentationData() throws IOException {
        String filePath = "../public/data/MS_Representation.json";
        return new String(Files.readAllBytes(Paths.get(filePath)));
    }

    @GetMapping("/states")
    public List<String> getStates() {
        return List.of("Mississippi", "Connecticut");
    }

    @GetMapping(value = "/CT_precinct_data", produces = "text/csv")
    public String getCTPrecinctData() throws IOException {
        String filePath = "../public/data/CT_precinct_data.csv";
        return new String(Files.readAllBytes(Paths.get(filePath)));
    }

    @GetMapping(value = "/MS_precinct_data", produces = "text/csv")
    public String getMSPrecinctData() throws IOException {
        String filePath = "../public/data/MS_precinct_data.csv";
        return new String(Files.readAllBytes(Paths.get(filePath)));

    }

    @GetMapping(value = "/RaceEcoInferenceData", produces = "application/json")
    public String getRaceEcoInferenceData() throws IOException {
        String filePath = "../public/data/RaceEcoInferenceData.json";
        return new String(Files.readAllBytes(Paths.get(filePath)));
    }

    @GetMapping(value = "/boundary-data", produces = "application/json")
    public ResponseEntity<String> getBoundaryDataOld(
            @RequestParam String state,
            @RequestParam String districtType) throws IOException {

        String filePath = "";

        if (state.equalsIgnoreCase("Connecticut")) {
            switch (districtType) {
                case "cd":
                    filePath = "../public/data/CT_CD_boundaries.json";
                    break;
                case "county":
                    filePath = "../public/data/connecticut_county_borders.json";
                    break;
                case "precinct":
                    filePath = "../public/data/CT_precinctAndVotingData.geojson";
                    break;
                case "income":
                    filePath = "../public/data/CT_incomeByBlock.geojson";
                    break;
                default:
                    return ResponseEntity.badRequest().body("Invalid district type.");
            }
        } else if (state.equalsIgnoreCase("Mississippi")) {
            switch (districtType) {
                case "cd":
                    filePath = "../public/data/MS_CD_boundaries.json";
                    break;
                case "county":
                    filePath = "../public/data/mississippi_county_borders.json";
                    break;
                case "precinct":
                    filePath = "../public/data/MS_precinctAndVotingData.geojson";
                    break;
                case "income":
                    filePath = "../public/data/MS_incomeByBlock.geojson";
                    break;
                default:
                    return ResponseEntity.badRequest().body("Invalid district type.");
            }
        }

        if (!filePath.isEmpty()) {
            return ResponseEntity.ok(new String(Files.readAllBytes(Paths.get(filePath))));
        }

        return ResponseEntity.badRequest().body("Invalid state or district type.");
    }

}