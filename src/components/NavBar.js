import React, { useState, useEffect } from 'react';
import IncomeHeatmapLegend from './incomeHeatmapLegend.js';
import VotingHeatmapLegend from './votingHeatmapLegend.js';
import RaceHeatmapLegend from './raceHeatmap.js';
import RegionHeatmapLegend from './regionHeatmapLegend.js';
import PovertyHeatmapLegend from './legendPoverty.js';
import TrumpHeatmapLegend from './trumpLegend.js';
import BidenHeatmapLegend from './bidenLegend.js';
import PoliticalIncomeHeatmapLegend from './political_income_legend.js';

function NavBar({ handleZoomToMississippi, handleZoomToConnecticut, handleResetView, setSelectedTab,
    currentState, setSubCategory, handleHeatmaps, heatmapOn, currentHeatmap,
    setCurrentRace, currentRace, resetNavBar,}) {
    const [phase, setPhase] = useState('stateSelection');
    const [selectedState, setSelectedState] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSubCategory, setSelectedSubCategory] = useState(null);

    const states = ['Mississippi', 'Connecticut'];
    const categories = ['Overview', 'Race Analysis', 'Ecological Inferences'];
    const overviewSubCategories = ['State Summary', 'CD Representation'];
    const raceAnalysisSubCategories = ['Gingles', 'Gingles Table', 'Box-Plot'];
    const ecologicalSubCategories = ['Income', 'Race', 'Region'];
    const heatMaps = ['Heatmap Off', 'Voting/Electoral Heatmap', 'Income Heatmap', 'Race Heatmap', 'Region Heatmap', 'Poverty Heatmap', 'Political/Income Heatmap', 'Trump Heatmap', 'Biden Heatmap'];
    // took out heatmap auto for now

    useEffect(() => {
        if (currentState) {
            setSelectedState(currentState);
            setPhase('categorySelection');
            setSelectedCategory('Overview');
            setSelectedTab('Overview');
            setSelectedSubCategory('State Summary');
        } else {
            setSelectedState(null);
            setPhase('stateSelection');
        }
    }, [currentState]);

    useEffect(() => {
        if (resetNavBar) {
          // Reset all selections
          setPhase('stateSelection');
          setSelectedState(null);
          setSelectedCategory(null);
          setSelectedSubCategory(null);
        }
      }, [resetNavBar]);

    const handleStateSelection = (state) => {
        setSelectedState(state);
        setPhase('categorySelection');
        if (state === 'Mississippi') {
            handleZoomToMississippi();
        } else if (state === 'Connecticut') {
            handleZoomToConnecticut();
        }
    };

    const handleCategorySelection = (category) => {
        setSelectedCategory(category);
        setSelectedTab(category);
        if (category === 'Overview') {
            setSelectedSubCategory('State Summary');
            setSubCategory('State Summary');
        } else if (category === 'Race Analysis') {
            setSelectedSubCategory('Gingles');
            setSubCategory('Gingles');
        } else if (category === 'Ecological Inferences') {
            setSelectedSubCategory('Income');
            setSubCategory('Income');
        }
    };

    const handleSubCategorySelection = (subCategory) => {
        setSelectedSubCategory(subCategory);
        setSubCategory(subCategory);
    };

    const handleHeatmapSelection = (heatmap) => {
        return;
    };

    const subCategories =
        selectedCategory === 'Overview'
            ? overviewSubCategories
            : selectedCategory === 'Race Analysis'
                ? raceAnalysisSubCategories
                : selectedCategory === 'Ecological Inferences'
                    ? ecologicalSubCategories
                    : [];

    return (
        <div style={navBarContainerStyle}>
            {/* State Selection Dropdown */}
            <div>
                <label htmlFor="stateSelect" style={labelStyle}>
                    Select State:
                </label>
                <select
                    id="stateSelect"
                    style={dropdownStyle}
                    value={selectedState || ''}
                    onChange={(e) => handleStateSelection(e.target.value)}
                >
                    <option value="" disabled>
                        -- Select a State --
                    </option>
                    {states.map((state, index) => (
                        <option key={index} value={state}>
                            {state}
                        </option>
                    ))}
                </select>
            </div>

            {/* Category Selection Dropdown */}
            {phase === 'categorySelection' && (
                <div>
                    <label htmlFor="categorySelect" style={labelStyle}>
                        Select Category:
                    </label>
                    <select
                        id="categorySelect"
                        style={dropdownStyle}
                        value={selectedCategory || ''}
                        onChange={(e) => handleCategorySelection(e.target.value)}
                    >
                        <option value="" disabled>
                            -- Select a Category --
                        </option>
                        {categories.map((category, index) => (
                            <option key={index} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Subcategory Selection Dropdown */}
            {selectedCategory && (
                <div>
                    <label htmlFor="subCategorySelect" style={labelStyle}>
                        Select Subcategory:
                    </label>
                    <select
                        id="subCategorySelect"
                        style={dropdownStyle}
                        value={selectedSubCategory}
                        onChange={(e) => handleSubCategorySelection(e.target.value)}
                    >
                        <option value="" disabled>
                            -- Select a Subcategory --
                        </option>
                        {subCategories.map((subCategory, index) => (
                            <option key={index} value={subCategory}>
                                {subCategory}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Select Heatmap */}
            <div>
                <label htmlFor="stateSelect" style={labelStyle}>
                    Select Heatmap:
                </label>
                <select
                    id="stateSelect"
                    style={dropdownStyle}
                    value={currentHeatmap || ''}
                    onChange={(e) => handleHeatmaps(e.target.value, false)}
                >
                    <option value="" disabled>
                        -- Select a Heatmap --
                    </option>
                    {heatMaps.map((heatmap, index) => (
                        <option key={index} value={heatmap}>
                            {heatmap}
                        </option>
                    ))}
                </select>
            </div>

            {heatmapOn && currentHeatmap === 'Voting/Electoral Heatmap' && <VotingHeatmapLegend />}
            {heatmapOn && currentHeatmap === 'Income Heatmap' && <IncomeHeatmapLegend />}
            {heatmapOn && currentHeatmap === 'Race Heatmap' && <RaceHeatmapLegend currentRace={currentRace} setCurrentRace={setCurrentRace} />}
            {heatmapOn && currentHeatmap === 'Region Heatmap' && <RegionHeatmapLegend />}
            {heatmapOn && currentHeatmap === 'Poverty Heatmap' && <PovertyHeatmapLegend />}
            {heatmapOn && currentHeatmap === 'Trump Heatmap' && <TrumpHeatmapLegend />}
            {heatmapOn && currentHeatmap === 'Biden Heatmap' && <BidenHeatmapLegend />}
            {heatmapOn && currentHeatmap === 'Political/Income Heatmap' && <PoliticalIncomeHeatmapLegend />}
        </div>
    );
}

// Styles
const navBarContainerStyle = {
    width: '100%',
    backgroundColor: '#024B4B',
    color: 'white',
    height: '100%',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '10px',
};

const dropdownStyle = {
    padding: '10px',
    margin: '5px 0',
    width: '100%',
    backgroundColor: '#036666',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '14px',
    fontWeight: 'bold',
};

const labelStyle = {
    marginBottom: '5px',
    fontSize: '14px',
    fontWeight: 'bold',
};

export default NavBar;