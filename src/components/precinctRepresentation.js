import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PrecinctRepresentation = ({ currentState, precinct }) => {
  const [precinctData, setPrecinctData] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      if (!currentState) return;

      try {
        // Step 1: Fetch the file name
        const response = await axios.get(`http://localhost:8080/api/data/${currentState}/Master_Data`);
        const fileName = response.data; // File name or URL from the first response
        console.log("File Name: ", fileName);

        // Step 2: Fetch the actual file data
        const fileResponse = await axios.get(fileName);
        const data = fileResponse.data; // The actual GeoJSON data
        console.log("File Response: ", data);

        // Extract precincts from the data
        let precincts;
        console.log("Precinct: " + precinct);

        if (precinct === 'All') {
          // Get all precincts
          precincts = data?.features?.precincts?.map((feature) => feature.properties);
        } else {
          // Filter for the specific precinct by name
          precincts = data?.features?.precincts
            ?.filter((feature) => feature.properties.NAME20 === precinct)
            ?.map((feature) => feature.properties);
        }


        if (precincts) {
          setPrecinctData(precincts);
        } else {
          console.error("Invalid data structure: Missing precincts array");
          setPrecinctData([]);
        }
      } catch (error) {
        console.error(`Error fetching data for ${currentState}:`, error);
        setPrecinctData(null);
      }
    };

    fetchData();
  }, [currentState, precinct]);


  if (!currentState) {
    return <p style={loadingStyle}>Please select a state.</p>;
  }

  if (!precinctData) {
    return <p style={loadingStyle}>Loading data...</p>;
  }

  return (
    <div style={tableContainerStyle}>
      <h2 style={titleStyle}>{`Precinct Representation for ${currentState}`}</h2>
      <div style={scrollableTableStyle}>
        <table style={tableStyle}>
          <thead style={tableHeadStyle}>
            <tr>
              <th style={headerStyle}>Precinct Name</th>
              <th style={headerStyle}>Region Type</th>
              <th style={headerStyle}>Total Population</th>
              <th style={headerStyle}>Minority Population</th>
              <th style={headerStyle}>Average Household Income</th>
              <th style={headerStyle}>Republican Votes</th>
              <th style={headerStyle}>Democratic Votes</th>
            </tr>
          </thead>
          <tbody style={{ height: '100%' }}>
            {precinctData.map((precinct, index) => {
              const minorityPopulation =
                (precinct.BLK_NHSP22 || 0) +
                (precinct.HSP_POP22 || 0) +
                (precinct.ASN_NHSP22 || 0) +
                (precinct.OTH_NHSP22 || 0);

              return (
                <tr key={index} style={{ textAlign: 'center' }}>
                  <td style={contentStyle}>{precinct.NAME20}</td>
                  <td style={contentStyle}>{precinct.category}</td>
                  <td style={contentStyle}>{precinct.TOT_POP22.toLocaleString()}</td>
                  <td style={contentStyle}>{minorityPopulation.toLocaleString()}</td>
                  <td style={contentStyle}>
                    {precinct.MEDN_INC22 != null ? `$${precinct.MEDN_INC22.toLocaleString()}` : "N/A"}
                  </td>

                  <td style={contentStyle}>{precinct.G20PRERTRU.toLocaleString()}</td>
                  <td style={contentStyle}>{precinct.G20PREDBID.toLocaleString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const loadingStyle = {
  color: 'white',
  textAlign: 'center',
};

const tableContainerStyle = {
  height: '100%',
  width: '100%',
  //marginBottom: '20px',
  border: '1px solid #ccc',
  fontFamily: '"Arial", sans-serif',
  borderRadius: '8px',
  overflow: 'hidden', // Prevent overflow for the overall container
};

const titleStyle = {
  color: 'black',
  textAlign: 'center',
};

const scrollableTableStyle = {
  maxHeight: '600px', // Adjust the height of the scrollable area
  overflowY: 'auto', // Enable vertical scrolling
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  tableLayout: 'fixed',
};

const tableHeadStyle = {
  position: 'sticky',
  top: 0, // Keep the header fixed at the top
  backgroundColor: '#333',
  zIndex: 1, // Ensure the header stays on top
};

const headerStyle = {
  border: '1px solid #ccc',
  padding: '8px',
  backgroundColor: '#333',
  color: '#fff',
};

const contentStyle = {
  border: '1px solid #ccc',
  padding: '8px',
};

export default PrecinctRepresentation;
