import React, { useState } from 'react';
import PrecinctAnalysis from './PrecinctAnalysis';
import BoxPlotDisplay from './boxPlotDisplay';
import PrecinctRepresentation from './precinctRepresentation';

const RaceAnalysis = ({ currentState, selectedSubCategory, precinct }) => {

    return (
        <div>
            <div>
                {selectedSubCategory === 'Gingles' && <PrecinctAnalysis currentState={currentState} />}
                {selectedSubCategory === 'Gingles Table' && <PrecinctRepresentation currentState={currentState} precinct='All' />}
                {selectedSubCategory === 'Box-Plot' && <BoxPlotDisplay currentState={currentState} />}
            </div>
        </div>
    );
};

export default RaceAnalysis;