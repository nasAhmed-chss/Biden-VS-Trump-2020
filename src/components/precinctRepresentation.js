import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PrecinctRepresentation = ({ currentState, precinct }) => {
  const [precinctData, setPrecinctData] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      if (!currentState) return;

      try {
        // Fetch the master GeoJSON directly from the Next.js API route
        const fileResponse = await axios.get(`/api/data/${currentState}/Master_Data`);
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
      <h2 style={titleStyle}>{`Precinct Representation — ${currentState}`}</h2>
      <div style={scrollableTableStyle}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={headerStyle}>Precinct Name</th>
              <th style={headerStyle}>Region Type</th>
              <th style={headerStyle}>Total Population</th>
              <th style={headerStyle}>Minority Population</th>
              <th style={headerStyle}>Avg. Household Income</th>
              <th style={headerStyle}>Republican Votes</th>
              <th style={headerStyle}>Democratic Votes</th>
            </tr>
          </thead>
          <tbody>
            {precinctData.map((precinct, index) => {
              const minorityPopulation =
                (precinct.BLK_NHSP22 || 0) +
                (precinct.HSP_POP22 || 0) +
                (precinct.ASN_NHSP22 || 0) +
                (precinct.OTH_NHSP22 || 0);

              const isEven = index % 2 === 0;

              return (
                <tr key={index} style={{ textAlign: 'center', backgroundColor: isEven ? 'rgba(255,255,255,0.03)' : 'transparent' }}>
                  <td style={contentStyle}>{precinct.NAME20}</td>
                  <td style={{ ...contentStyle, ...getCategoryBadgeStyle(precinct.category) }}>{precinct.category}</td>
                  <td style={contentStyle}>{precinct.TOT_POP22.toLocaleString()}</td>
                  <td style={contentStyle}>{minorityPopulation.toLocaleString()}</td>
                  <td style={contentStyle}>
                    {precinct.MEDN_INC22 != null ? `$${precinct.MEDN_INC22.toLocaleString()}` : "N/A"}
                  </td>
                  <td style={{ ...contentStyle, color: '#ef9a9a' }}>{precinct.G20PRERTRU.toLocaleString()}</td>
                  <td style={{ ...contentStyle, color: '#90caf9' }}>{precinct.G20PREDBID.toLocaleString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Helper for region type badge coloring
const getCategoryBadgeStyle = (category) => {
  const map = {
    Urban:    { color: '#80deea' },
    Suburban: { color: '#a5d6a7' },
    Rural:    { color: '#ffcc80' },
  };
  return map[category] || { color: 'rgba(255,255,255,0.6)' };
};

const loadingStyle = {
  color: 'rgba(255,255,255,0.6)',
  textAlign: 'center',
  fontFamily: 'Inter, Arial, sans-serif',
  padding: '20px',
};

const tableContainerStyle = {
  width: '100%',
  border: '1px solid rgba(255,255,255,0.1)',
  fontFamily: 'Inter, Arial, sans-serif',
  borderRadius: '14px',
  overflow: 'hidden',
  background: 'rgba(0,0,0,0.2)',
};

const titleStyle = {
  color: '#80cbc4',
  textAlign: 'center',
  fontSize: '1.1rem',
  fontWeight: '700',
  letterSpacing: '0.03em',
  margin: '16px 0 12px',
};

const scrollableTableStyle = {
  maxHeight: '320px',
  overflowY: 'auto',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  tableLayout: 'fixed',
};

const headerStyle = {
  padding: '10px 8px',
  backgroundColor: 'rgba(0,60,60,0.8)',
  color: 'rgba(255,255,255,0.85)',
  fontSize: '12px',
  fontWeight: '700',
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  borderBottom: '1px solid rgba(255,255,255,0.1)',
  position: 'sticky',
  top: 0,
  zIndex: 1,
};

const contentStyle = {
  padding: '9px 8px',
  fontSize: '13px',
  color: 'rgba(255,255,255,0.75)',
  borderBottom: '1px solid rgba(255,255,255,0.05)',
};

export default PrecinctRepresentation;
