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

            <h4 style={sectionHeaderStyle}>Graph {graphNumber}</h4>
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
    marginBottom: '20px',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    marginTop: '20px',
};

const sectionHeaderStyle = {
    fontSize: '1rem',
    fontFamily: '"Arial", sans-serif',
    marginBottom: '10px',
    textAlign: 'center',
};

const dropdownLabelStyle = {
    fontSize: '0.9rem',
    fontFamily: '"Arial", sans-serif',
    marginBottom: '5px',
    display: 'block',
};

const dropdownStyle = {
    width: '100%',
    padding: '8px',
    fontSize: '0.9rem',
    fontFamily: '"Arial", sans-serif',
    marginBottom: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
};

export default Controller;
