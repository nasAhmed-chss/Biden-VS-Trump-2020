import React, { useState } from 'react';
import GinglesGraph from './GinglesGraph';
import PrecinctRepresentation from './precinctRepresentation';



const PrecinctAnalysis = ({ currentState }) => {
    const [populationType, setPopulationType] = useState('White');
    const [locationType, setLocationType] = useState('All');
    const [precinct, setPrecinct] = useState('Caledonia');

    const title = currentState === 'Mississippi'
        ? 'Precinct Analysis'
        : 'Precinct Analysis';

    return (
        <div style={containerStyle}>
            <h2 style={{ color: 'black', textAlign: 'center', padding: '0px', margin: "0px", fontFamily: '"Arial", sans-serif' }}>{title}</h2>
            <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                <GinglesGraph populationType={populationType} locationType={locationType} currentState={currentState} setPrecinct={setPrecinct} />


            </div>



            <div style={buttonGroupContainerStyle}>
                <button
                    style={buttonStyle}
                    onClick={() => setPopulationType('White')}
                >
                    White
                </button>
                <button
                    style={buttonStyle}
                    onClick={() => setPopulationType('African American')}
                >
                    Black
                </button>
                <button
                    style={buttonStyle}
                    onClick={() => setPopulationType('Hispanic/Latino')}
                >
                    Hispanic/Latino
                </button>
                <button
                    style={buttonStyle}
                    onClick={() => setPopulationType('Asian')}
                >
                    Asian
                </button>
                <button
                    style={buttonStyle}
                    onClick={() => setPopulationType('Other Races')}
                >
                    Other Races
                </button>
                <button
                    style={buttonStyle}
                    onClick={() => setPopulationType('Income')}
                >
                    Income Gingles Graph
                </button>
            </div>
            <div style={buttonGroupContainerStyle}>

                <label htmlFor="location-select" style={{ marginRight: '10px', fontSize: '16px',  fontFamily: '"Arial", sans-serif' }}>
                    Select Location Type:
                </label>
                <select
                    id="location-select"
                    value={locationType}
                    onChange={(e) => setLocationType(e.target.value)}
                    style={{
                        padding: '5px',
                        fontSize: '16px',
                        borderRadius: '5px',
                        border: '1px solid #ccc',
                    }}
                >
                    <option value="All">All</option>
                    <option value="Urban">Urban</option>
                    <option value="Suburban">Suburban</option>
                    <option value="Rural">Rural</option>
                    {populationType !== 'Income' && (
                        <option value={'Income/'}>Income/{populationType}</option>
                    )}
                </select>

            </div>
            <div style={{ marginTop: '10px' }}>
                <PrecinctRepresentation currentState={currentState} precinct={precinct} />
            </div>
        </div>
    );
};

export default PrecinctAnalysis;

// Styles
const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
};

const buttonGroupContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px',
    gap: '10px',
    flexWrap: 'wrap',
};

const centeredButtonContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100px',
};

const buttonStyle = {
    padding: '10px 20px',
    borderRadius: '25px',
    border: '1px solid #ccc',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '14px',
    backgroundColor: 'white',
    color: '#333',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    fontWeight: 'bold',
};

buttonStyle[':hover'] = {
    backgroundColor: '#007BFF',
    color: 'white',
    transform: 'scale(1.05)',
};
