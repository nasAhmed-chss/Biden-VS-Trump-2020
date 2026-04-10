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
    color: 'black',
    backgroundColor: '#F9F9F9',
    padding: '20px',
    boxSizing: 'border-box',
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
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
