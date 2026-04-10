import React, { useState } from 'react';
import IncomeEcologicalInference from './IncomeEcologicalInference';
import RaceEcologicalInference from './RaceEcologicalInference';
import Controller from './IncomeEcoController';
import RaceEcoBar from './RaceEcoBar';
import IncomeEcoBar from './IncomeEcoBar';
import RegionEcoBar from './RegionEcoBar';
import RegionEcologicalInference from './RegionEcologicalInference';
const EcologicalAnalysis = ({ currentState, selectedSubCategory }) => {
    const [incomeType, setIncomeType] = useState('High Income');
    const [incomeType2, setIncomeType2] = useState('Middle Income');
    const [candidate, setCandidate] = useState('Democrat');
    const [candidate2, setCandidate2] = useState('Democrat');
    const [candidate3, setCandidate3] = useState('Democrat');
    const [candidate4, setCandidate4] = useState('Democrat');
    const [candidate5, setCandidate5] = useState('Democrat');
    const [candidate6, setCandidate6] = useState('Democrat');
    const [populationType, setPopulationType] = useState('Black');
    const [populationType2, setPopulationType2] = useState('White');
    const [chartType, setChartType] = useState('Bar');
    const [regionType, setRegionType] = useState('Urban');
    const [regionType2, setRegionType2] = useState('Rural');


    const renderCharts = () => {
        if (chartType === 'Bar' && selectedSubCategory === 'Income') {
            return <IncomeEcoBar state={currentState} />;
        } else if (chartType === 'Bar' && selectedSubCategory === 'Race') {
            return <RaceEcoBar state={currentState} />;
        } else if (chartType === 'Bar' && selectedSubCategory === 'Region') {
            return <RegionEcoBar state={currentState} />;
        }
        else {
            if (selectedSubCategory === 'Income') {
                return (
                    <>
                        <IncomeEcologicalInference state={currentState} party={candidate} incomeType={incomeType} />
                        <IncomeEcologicalInference state={currentState} party={candidate2} incomeType={incomeType2} />
                    </>
                );
            } else if (selectedSubCategory === 'Race') {
                return (
                    <>
                        <RaceEcologicalInference state={currentState} party={candidate3} populationType={populationType} />
                        <RaceEcologicalInference state={currentState} party={candidate4} populationType={populationType2} />
                    </>
                );
            } else {

                return (<>
                    <RegionEcologicalInference state={currentState} party={candidate5} region={regionType} />
                    <RegionEcologicalInference state={currentState} party={candidate6} region={regionType2} />

                </>);
            }
        }
    };

    return (
        <div style={containerStyle}>
            <div style={chartsContainerStyle}>
                <h1 style={{ textAlign: 'center', margin: '10px 0', marginLeft: '0px', fontFamily: '"Arial", sans-serif' }}>Ecological Inferences</h1>
                <div style={graphWrapperStyle}>{renderCharts()}</div>
            </div>
            <div style={controllerContainerStyle}>
                <h3 style={controllerHeaderStyle}>Comparing Graphs</h3>
                <div style={buttonGroupStyle}>
                    <button style={buttonStyle} onClick={() => setChartType('Bar')}>
                        Bar Chart
                    </button>
                    <button style={buttonStyle} onClick={() => setChartType('Eco')}>
                        Eco. Inf.
                    </button>
                </div>
                {selectedSubCategory === 'Income' ? (
                    <>
                        <Controller
                            selectedSubCategory={selectedSubCategory}
                            graphNumber={1}
                            candidate={candidate}
                            incomeType={incomeType}
                            onCandidateChange={(e) => setCandidate(e.target.value)}
                            onIncomeChange={(e) => setIncomeType(e.target.value)}

                        />
                        <Controller
                            selectedSubCategory={selectedSubCategory}
                            graphNumber={2}
                            candidate={candidate2}
                            incomeType={incomeType2}
                            onCandidateChange={(e) => setCandidate2(e.target.value)}
                            onIncomeChange={(e) => setIncomeType2(e.target.value)}

                        />
                    </>
                ) : selectedSubCategory === 'Race' ? (
                    <>
                        <Controller
                            selectedSubCategory={selectedSubCategory}
                            graphNumber={3}
                            candidate={candidate3}
                            populationType={populationType}
                            onCandidateChange={(e) => setCandidate3(e.target.value)}
                            onPopulationChange={(e) => setPopulationType(e.target.value)}

                        />
                        <Controller
                            selectedSubCategory={selectedSubCategory}
                            graphNumber={4}
                            candidate={candidate4}
                            populationType={populationType2}
                            onCandidateChange={(e) => setCandidate4(e.target.value)}
                            onPopulationChange={(e) => setPopulationType2(e.target.value)}

                        />
                    </>
                ) : selectedSubCategory === 'Region' ? (
                    <>
                        <Controller
                            selectedSubCategory={selectedSubCategory}
                            graphNumber={5}
                            candidate={candidate5}
                            region={regionType}
                            onCandidateChange={(e) => setCandidate5(e.target.value)}
                            onRegionChange={(e) => setRegionType(e.target.value)}
                        />
                        <Controller
                            selectedSubCategory={selectedSubCategory}
                            graphNumber={6}
                            candidate={candidate6}
                            region={regionType2}
                            onCandidateChange={(e) => setCandidate6(e.target.value)}
                            onRegionChange={(e) => setRegionType2(e.target.value)}
                        />
                    </>
                ) : null}
            </div>
        </div>
    );
};


const containerStyle = {
    display: 'flex',
    flexDirection: 'row', // Align legend and graphs side-by-side
    alignItems: 'flex-start', // Align items at the top
    gap: '20px', // Space between legend and charts
    width: '100%',

};



const chartsContainerStyle = {
    flex: 1, // Take up remaining space
    display: 'flex',
    flexDirection: 'column', // Arrange graphs vertically
    justifyContent: 'center', // Center graphs
    alignItems: 'center', // Center graphs horizontally
    gap: '10px', // Reduce space between elements
    width: '90%',
    paddingTop: '10px',
};

const graphWrapperStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center', // Center individual charts horizontally
    justifyContent: 'center',
    width: '100%',


};

const controllerContainerStyle = {
    width: '100%', // Allocate a smaller portion for the controller
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: '10px',
    borderLeft: '1px solid #ccc', // Faint separating line
    height: '100%',
    marginLeft: '3%'
};




const controllerHeaderStyle = {
    fontSize: '1.2rem',
    fontFamily: '"Arial", sans-serif',
    marginBottom: '20px',
    fontFamily: '"Arial", sans-serif'
};

const controllerSectionStyle = {
    width: '100%',
    marginBottom: '20px',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    marginTop: '50%'
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

const buttonGroupStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '20px',
};

const buttonStyle = {
    padding: '8px 15px',
    fontSize: '0.9rem',
    fontFamily: '"Arial", sans-serif',
    color: '#000', // Black text for contrast
    backgroundColor: '#fff', // White button color
    border: '1px solid #ccc', // Subtle border
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, color 0.3s ease',
};

const buttonHoverStyle = {
    backgroundColor: '#007bff', // Blue hover color
    color: '#fff', // White text on hover
};


export default EcologicalAnalysis;