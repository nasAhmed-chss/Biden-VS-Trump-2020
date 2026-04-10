## Getting Started

## To run the server:

1. Install Prerequisites: JDK version 8 or higher, Maven, MongoDB
2. Run the mongoDB by putting entering this command: "mongod"
    - the default port is (27017)
3. Create a collection on mongoDB called "416_Project_Data"
4. Run this command to populate the db: "node populate_state_borders.js"
5. cd into the "backEnd" folder and run the command to build the project: "mvn clean install"
6. Then start the server with the command: "mvn spring-boot:run"
    - the default port it runs at is 8080
7. You can verify the server is running but going to http://localhost:8080/api/data/connect
8. You enter other URLs to verify correct data retrival (ex: http://localhost:8080/api/data/state-borders)
9. Once finished, use CTRL + C to close the server from the terminal