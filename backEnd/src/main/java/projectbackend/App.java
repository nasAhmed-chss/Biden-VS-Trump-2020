package projectbackend;

import projectbackend.db.MongoDBConnection;

public class App {
    public static void main(String[] args) {
        System.out.println("Initializing the app...");

        // Create a new MongoDBConnection instance
        MongoDBConnection mongoDBConnection = new MongoDBConnection();

        // Use the database (for example, just printing the database name)
        System.out.println("Connected to the database: " + mongoDBConnection.getDatabase().getName());

        // Close the connection
        mongoDBConnection.close();
    }
}
