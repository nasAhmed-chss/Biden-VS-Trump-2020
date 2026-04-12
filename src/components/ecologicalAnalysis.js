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
                <h1 style={{
                    textAlign: 'center',
                    margin: '0 0 16px 0',
                    fontFamily: 'Inter, Arial, sans-serif',
                    fontSize: '1.4rem',
                    fontWeight: '700',
                    color: '#80cbc4',
                    letterSpacing: '0.03em',
                }}>Ecological Inferences</h1>
                <div style={graphWrapperStyle}>{renderCharts()}</div>
            </div>
            <div style={controllerContainerStyle}>
                <h3 style={controllerHeaderStyle}>Compare Graphs</h3>
                <div style={buttonGroupStyle}>
                    <button style={chartType === 'Bar' ? activeButtonStyle : buttonStyle} onClick={() => setChartType('Bar')}>
                        Bar Chart
                    </button>
                    <button style={chartType === 'Eco' ? activeButtonStyle : buttonStyle} onClick={() => setChartType('Eco')}>
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
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: '16px',
    width: '100%',
};

const chartsContainerStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: '10px',
    minWidth: 0,
    paddingTop: '10px',
};

const graphWrapperStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
};

const controllerContainerStyle = {
    width: '180px',
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    padding: '12px',
    borderLeft: '1px solid rgba(255,255,255,0.08)',
    gap: '10px',
};

const controllerHeaderStyle = {
    fontSize: '12px',
    fontFamily: 'Inter, Arial, sans-serif',
    fontWeight: '700',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.45)',
    margin: '0 0 6px',
    textAlign: 'center',
};

const buttonGroupStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '6px',
    marginBottom: '8px',
};

const btnBase = {
    padding: '7px 12px',
    fontSize: '12px',
    fontFamily: 'Inter, Arial, sans-serif',
    fontWeight: '600',
    borderRadius: '7px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: '1px solid rgba(255,255,255,0.15)',
};

const buttonStyle = {
    ...btnBase,
    background: 'rgba(255,255,255,0.06)',
    color: 'rgba(255,255,255,0.65)',
};

const activeButtonStyle = {
    ...btnBase,
    background: 'linear-gradient(135deg, #00796b, #004d40)',
    color: 'white',
    border: '1px solid rgba(0,200,170,0.35)',
};


export default EcologicalAnalysis;