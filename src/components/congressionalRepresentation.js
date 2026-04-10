import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CongressionalRepresentation = ({ currentState, childSetDistrictHighlighted }) => {
  const [stateData, setStateData] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null); // Track selected row

  useEffect(() => {
    if (!currentState) {
      setStateData(null);
      return;
    }

    const endpoints = {
      Connecticut: '/api/data/CT_Representation',
      Mississippi: '/api/data/MS_Representation',
    };

    const endpoint = endpoints[currentState];

    if (!endpoint) {
      console.error('Invalid state selected');
      setStateData(null);
      return;
    }

    axios
      .get(endpoint)
      .then((response) => {
        if (response.data && response.data.districts) {
          setStateData(response.data.districts);
        } else {
          setStateData(null);
        }
      })
      .catch((error) => {
        console.error(`Error fetching data for ${currentState}:`, error);
        setStateData(null);
      });
  }, [currentState]);

  // Handle row click: update local selection and notify parent
  const handleRowClick = (districtNumber) => {
    if (districtNumber == selectedDistrict) {
      setSelectedDistrict(null);
      childSetDistrictHighlighted(null);
    } else {
      setSelectedDistrict(districtNumber); // Highlight row
      childSetDistrictHighlighted(districtNumber); // Notify parent
    }
  };

  if (!currentState) {
    return <p style={loadingStyle}>Please select a state.</p>;
  }

  if (!stateData) {
    return <p style={loadingStyle}>Loading data...</p>;
  }

  return (
    <div style={tableContainerStyle}>
      <h2 style={titleStyle}>{`Congressional Representation for ${currentState}`}</h2>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={headerStyle}>District Number</th>
            <th style={headerStyle}>Rep</th>
            <th style={headerStyle}>Party</th>
            <th style={headerStyle}>Average Income</th>
            <th style={headerStyle}>Poverty %</th>
            <th style={headerStyle}>Urban %</th>
            <th style={headerStyle}>Suburb %</th>
            <th style={headerStyle}>Rural %</th>
            <th style={headerStyle}>Vote Margin %</th>
          </tr>
        </thead>
        <tbody>
          {stateData.map((district) => (
            <tr
              key={district.district_number}
              style={{
                textAlign: 'center',
                cursor: 'pointer',
                backgroundColor: selectedDistrict === district.district_number ? '#f0f8ff' : 'transparent',
              }}
              onClick={() => handleRowClick(district.district_number)} // Call handler on row click
            >
              <td style={contentStyle}>{district.district_number}</td>
              <td style={contentStyle}>{district.representative}</td>
              <td style={contentStyle}>{district.party}</td>
              <td style={contentStyle}>${district.average_household_income.toLocaleString()}</td>
              <td style={contentStyle}>{district.poverty_percentage}%</td>
              <td style={contentStyle}>{district.urban_percentage}%</td>
              <td style={contentStyle}>{district.suburban_percentage}%</td>
              <td style={contentStyle}>{district.rural_percentage}%</td>
              <td style={contentStyle}>{district.vote_margin_percentage}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const loadingStyle = {
  color: 'white',
  textAlign: 'center'
};

const tableContainerStyle = {
  height: '100%',
  width: '100%',
  margin: '0 auto',
  overflow: 'auto',
  border: '1px solid #ccc',
  fontFamily: '"Arial", sans-serif',
  borderRadius: '8px',
  padding: '10px'
};

const titleStyle = {
  color: 'black',
  textAlign: 'center'
};

const tableStyle = {
  width: '100%',
  height: 'auto',
  borderCollapse: 'collapse',
  tableLayout: 'fixed'
};

const headerStyle = {
  border: '1px solid #ccc',
  padding: '8px',
  backgroundColor: '#333',
  color: '#fff'
};

const contentStyle = {
  border: '1px solid #ccc',
  padding: '8px'
};

export default CongressionalRepresentation;
