import React, { useState } from 'react';
import StateOverview from './stateOverview';
import RaceAnalysis from './raceAnalysis';
import EcologicalAnalysis from './ecologicalAnalysis';

function DisplayData({ currentState, selectedTab, selectedCategory, setSelectedCategory, setSubCategory, selectedSubCategory, childSetDistrictHighlighted }) {



    return (
        <div style={containerStyle}>


            {selectedTab === 'Overview' && (
                <StateOverview currentState={currentState} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} selectedSubCategory={selectedSubCategory} childSetDistrictHighlighted={childSetDistrictHighlighted} />
            )}
            {selectedTab === 'Race Analysis' && (
                <RaceAnalysis currentState={currentState} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} selectedSubCategory={selectedSubCategory} />
            )}
            {selectedTab === 'Ecological Inferences' && (
                <EcologicalAnalysis currentState={currentState} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} selectedSubCategory={selectedSubCategory} />
            )}

        </div>
    );
}

const containerStyle = {
    position: 'relative',
    width: '55%',
    color: 'white',
    background: 'linear-gradient(160deg, #011e1e 0%, #022a2a 100%)',
    padding: '20px',
    boxSizing: 'border-box',
    overflowY: 'auto',
    overflowX: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    borderLeft: '1px solid rgba(255,255,255,0.07)',
    height: '100%',
};

const tabsContainerStyle = {
    display: 'flex',
    justifyContent: 'space-around',
    marginBottom: '20px',
    borderBottom: '2px solid #007bff',
    width: '100%',
};

const tabStyle = {
    padding: '8px 16px',
    margin: '0 5px',
    border: '1px solid grey',
    backgroundColor: '#555555',
    color: 'black',
    cursor: 'pointer',
    fontFamily: 'Open Sans, sans-serif',
    fontWeight: 'bold',
    fontSize: '14px',
    transition: 'background-color 0.3s ease',
    borderRadius: '5px 5px 0 0',
    flex: '1',
    maxWidth: '200px',
    textAlign: 'center',
    height: '40px',
};

const selectedTabStyle = {
    ...tabStyle,
    backgroundColor: '#007bff',
};

export default DisplayData;
