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
            {/* Sidebar Title */}
            <div style={{ paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '4px' }}>
                <p style={{ margin: 0, fontSize: '12px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>Controls</p>
            </div>

            {/* State Selection Dropdown */}
            <div style={dropdownWrapperStyle}>
                <label htmlFor="stateSelect" style={labelStyle}>
                    Select State
                </label>
                <select
                    id="stateSelect"
                    style={dropdownStyle}
                    value={selectedState || ''}
                    onChange={(e) => handleStateSelection(e.target.value)}
                >
                    <option value="" disabled>
                        — Select a State —
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
                <div style={dropdownWrapperStyle}>
                    <label htmlFor="categorySelect" style={labelStyle}>
                        Select Category
                    </label>
                    <select
                        id="categorySelect"
                        style={dropdownStyle}
                        value={selectedCategory || ''}
                        onChange={(e) => handleCategorySelection(e.target.value)}
                    >
                        <option value="" disabled>
                            — Select a Category —
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
                <div style={dropdownWrapperStyle}>
                    <label htmlFor="subCategorySelect" style={labelStyle}>
                        Select Subcategory
                    </label>
                    <select
                        id="subCategorySelect"
                        style={dropdownStyle}
                        value={selectedSubCategory}
                        onChange={(e) => handleSubCategorySelection(e.target.value)}
                    >
                        <option value="" disabled>
                            — Select a Subcategory —
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
            <div style={dropdownWrapperStyle}>
                <label htmlFor="heatmapSelect" style={labelStyle}>
                    Select Heatmap
                </label>
                <select
                    id="heatmapSelect"
                    style={dropdownStyle}
                    value={currentHeatmap || ''}
                    onChange={(e) => handleHeatmaps(e.target.value, false)}
                >
                    <option value="" disabled>
                        — Select a Heatmap —
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
    background: 'linear-gradient(180deg, #012e2e 0%, #011f1f 100%)',
    color: 'white',
    height: '100%',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    padding: '16px 12px',
    gap: '14px',
    borderRight: '1px solid rgba(255,255,255,0.07)',
    overflowY: 'auto',
};

const dropdownWrapperStyle = {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
};

const dropdownStyle = {
    padding: '10px 12px',
    width: '100%',
    backgroundColor: '#036060',
    color: 'white',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    outline: 'none',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 10px center',
    paddingRight: '32px',
    boxSizing: 'border-box',
    transition: 'background-color 0.2s, border-color 0.2s',
};

const labelStyle = {
    fontSize: '11px',
    fontWeight: '600',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.55)',
    paddingLeft: '2px',
};

export default NavBar;