import React from 'react';

const Controller = ({
    selectedSubCategory,
    graphNumber,
    candidate,
    incomeType, // Optional: For income dropdown
    populationType, // Optional: For population dropdown
    onCandidateChange,
    onIncomeChange, // Optional: For income dropdown
    onPopulationChange, // Optional: For population dropdown
    region,
    onRegionChange
}) => {
    return (

        <div style={controllerSectionStyle}>

            <h4 style={{ ...sectionHeaderStyle, color: '#80cbc4' }}>Graph {graphNumber}</h4>
            <label style={dropdownLabelStyle}>Candidate</label>
            <select
                style={dropdownStyle}
                value={candidate} // Bind the state to the dropdown
                onChange={onCandidateChange} // Update state on selection
            >
                <option value="Democrat">Biden</option>
                <option value="Republican">Trump</option>
            </select>

            {/* Conditional Dropdown Based on selectedSubCategory */}
            {selectedSubCategory === 'Income' ? (
                <>
                    <label style={dropdownLabelStyle}>Income Type</label>
                    <select
                        style={dropdownStyle}
                        value={incomeType} // Bind the state to the dropdown
                        onChange={onIncomeChange} // Update state on selection
                    >
                        <option value="All">All</option>
                        <option value="Low Income">Low Income</option>
                        <option value="Middle Income">Middle Income</option>
                        <option value="High Income">High Income</option>
                    </select>
                </>
            ) : selectedSubCategory === 'Race' ? (
                <>
                    <label style={dropdownLabelStyle}>Population Type</label>
                    <select
                        style={dropdownStyle}
                        value={populationType} // Bind the state to the dropdown
                        onChange={onPopulationChange} // Update state on selection
                    >
                        <option value="All">All</option>
                        <option value="White">White</option>
                        <option value="Black">Black</option>
                        <option value="Hispanic">Hispanic</option>
                        <option value="Asian">Asian</option>
                        <option value="Other">Other</option>
                    </select>
                </>
            ) : selectedSubCategory === 'Region' ? (
                <>
                    <label style={dropdownLabelStyle}>Region Type</label>
                    <select
                        style={dropdownStyle}
                        value={region} // Bind the state to the dropdown
                        onChange={onRegionChange} // Update state on selection
                    >
                        <option value="All">All</option>
                        <option value="Rural">Rural</option>
                        <option value="Suburban">Suburban</option>
                        <option value="Urban">Urban</option>
                    </select>
                </>
            ) : null}



        </div>
    );
};


const controllerSectionStyle = {
    width: '100%',
    padding: '12px',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    background: 'rgba(0,0,0,0.25)',
    boxSizing: 'border-box',
};

const sectionHeaderStyle = {
    fontSize: '11px',
    fontFamily: 'Inter, Arial, sans-serif',
    fontWeight: '700',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.4)',
    marginBottom: '10px',
    textAlign: 'center',
};

const dropdownLabelStyle = {
    fontSize: '11px',
    fontFamily: 'Inter, Arial, sans-serif',
    fontWeight: '600',
    color: 'rgba(255,255,255,0.5)',
    marginBottom: '4px',
    display: 'block',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
};

const dropdownStyle = {
    width: '100%',
    padding: '7px 10px',
    fontSize: '12px',
    fontFamily: 'Inter, Arial, sans-serif',
    fontWeight: '500',
    marginBottom: '10px',
    borderRadius: '7px',
    border: '1px solid rgba(255,255,255,0.15)',
    background: '#036060',
    color: 'white',
    outline: 'none',
    cursor: 'pointer',
    boxSizing: 'border-box',
};

export default Controller;
