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

    const demographics = ['White', 'African American', 'Hispanic/Latino', 'Asian', 'Other Races', 'Income'];

    return (
        <div style={containerStyle}>
            {/* Title */}
            <h2 style={titleStyle}>{title}</h2>

            {/* Chart */}
            <div style={chartWrapperStyle}>
                <GinglesGraph populationType={populationType} locationType={locationType} currentState={currentState} setPrecinct={setPrecinct} />
            </div>

            {/* Demographic toggle pills */}
            <div style={buttonGroupContainerStyle}>
                {demographics.map((demo) => (
                    <button
                        key={demo}
                        style={populationType === demo ? activeButtonStyle : buttonStyle}
                        onClick={() => setPopulationType(demo)}
                    >
                        {demo === 'African American' ? 'Black' : demo === 'Income' ? 'Income Graph' : demo}
                    </button>
                ))}
            </div>

            {/* Location type filter */}
            <div style={filterRowStyle}>
                <label htmlFor="location-select" style={filterLabelStyle}>
                    Location Type
                </label>
                <select
                    id="location-select"
                    value={locationType}
                    onChange={(e) => setLocationType(e.target.value)}
                    style={selectStyle}
                >
                    <option value="All">All</option>
                    <option value="Urban">Urban</option>
                    <option value="Suburban">Suburban</option>
                    <option value="Rural">Rural</option>
                    {populationType !== 'Income' && (
                        <option value={'Income/'}>Income / {populationType}</option>
                    )}
                </select>
            </div>

            {/* Table */}
            <div style={{ marginTop: '20px', width: '100%' }}>
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
    alignItems: 'center',
    width: '100%',
};

const titleStyle = {
    color: '#80cbc4',
    textAlign: 'center',
    fontSize: '1.4rem',
    fontWeight: '700',
    letterSpacing: '0.03em',
    margin: '0 0 20px',
    fontFamily: 'Inter, Arial, sans-serif',
};

const chartWrapperStyle = {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'rgba(0,0,0,0.25)',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.07)',
    padding: '12px 0',
    overflowX: 'auto',
};

const buttonGroupContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '18px',
    gap: '8px',
    flexWrap: 'wrap',
    width: '100%',
};

const buttonBase = {
    padding: '8px 18px',
    borderRadius: '20px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontSize: '13px',
    fontWeight: '600',
    fontFamily: 'Inter, Arial, sans-serif',
    letterSpacing: '0.02em',
};

const buttonStyle = {
    ...buttonBase,
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.15)',
    color: 'rgba(255,255,255,0.7)',
};

const activeButtonStyle = {
    ...buttonBase,
    background: 'linear-gradient(135deg, #00796b, #004d40)',
    border: '1px solid rgba(0,200,170,0.4)',
    color: 'white',
    boxShadow: '0 4px 12px rgba(0,121,107,0.35)',
};

const filterRowStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    marginTop: '16px',
    width: '100%',
};

const filterLabelStyle = {
    fontSize: '13px',
    fontWeight: '600',
    color: 'rgba(255,255,255,0.55)',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    fontFamily: 'Inter, Arial, sans-serif',
};

const selectStyle = {
    padding: '8px 36px 8px 12px',
    fontSize: '13px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.15)',
    background: '#036060',
    color: 'white',
    cursor: 'pointer',
    outline: 'none',
    fontFamily: 'Inter, Arial, sans-serif',
    fontWeight: '500',
};
