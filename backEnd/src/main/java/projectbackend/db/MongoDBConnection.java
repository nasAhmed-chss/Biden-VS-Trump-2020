package projectbackend.db;

import org.springframework.stereotype.Component;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoDatabase;

import io.github.cdimascio.dotenv.Dotenv;

@Component
public class MongoDBConnection {
    Dotenv dotenv = Dotenv.configure().load();

    private static final String CONNECTION_STRING = Dotenv.configure().load().get("MONGO_URI");
    private static final String DATABASE_NAME = "mainData";

    private MongoClient mongoClient;
    private MongoDatabase database;

    public MongoDBConnection() {
        connect();
    }

    private void connect() {
        try {
            mongoClient = MongoClients.create(CONNECTION_STRING);
            database = mongoClient.getDatabase(DATABASE_NAME);
            System.out.println("Connected to MongoDB!");
        } catch (Exception e) {
            System.err.println("Error connecting to MongoDB: " + e.getMessage());
        }
    }

    public MongoDatabase getDatabase() {
        return database;
    }

    public void close() {
        if (mongoClient != null) {
            mongoClient.close();
        }
    }
}
