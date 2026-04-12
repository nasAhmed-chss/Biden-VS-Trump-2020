import React, { useState } from 'react';
import MississippiVotesChart from './MississippiVotesChart';
import ConnecticutVotesChart from './ConnecticutVotesChart';
import RaceDistributionCT from './RaceDistributionCT';
import RaceDistributionMS from './RaceDistributionMS';
import IncomeDataCT from './incomeDataCT';
import IncomeDataMS from './incomeDataMS';
import CongressionalRepresentation from './congressionalRepresentation'
import './stateOverview.css';
import { text } from 'd3';

const StateOverview = ({ currentState, selectedSubCategory, childSetDistrictHighlighted }) => {
    const [selectedTab, setSelectedTab] = useState('Votes');


    const summaryData = {
        Connecticut: {
            totalPopulation: "3,605,944",
            votingAgePopulation: "2,850,000",
            voterDistribution: "Democratic: 57.5%, Republican: 40.1%, Other: 2.4%",
            racialDistribution: "White: 2,469,312, Hispanic: 630,000, African American: 406,000, Asian: 158,000, Other: 42,632",
            regionTypeDistribution: ["Rural: 2.80%", "Suburban: 42.40%", "Urban: 54.80%"],
            redistrictingControl: "Democratic Party",
            incomeDistribution: "Less than $25K: 10%, $25K - $50K: 15%, $50K - $75K: 20%, $75K - $125K: 30%, $125K or More: 25%",
            medianIncome: "$90,213",
            populationDensity: "739.1 / sq. mi.",
            povertyRate: "10.1%",
            politicalLean: "Democratic",
            numDistricts: 5,
            numPrecincts: 741,
            congressionalRepresentation: ["Democratic: 5 Representatives", "Republican: 0 Representatives"],
        },
        Mississippi: {
            totalPopulation: "2,949,965",
            votingAgePopulation: "2,200,000",
            voterDistribution: "Democratic: 44.8%, Republican: 53.3%, Other: 1.9%",
            racialDistribution: "White: 1,769,503, African American: 1,099,410, Hispanic: 40,000, Asian: 18,000, Other: 23,052",
            regionTypeDistribution: ["Rural: 39.87%", "Suburban: 39.63%", "Urban: 20.50%"],
            redistrictingControl: "Republican Party",
            incomeDistribution: "Less than $25K: 15%, $25K - $50K: 25%, $50K - $75K: 30%, $75K - $125K: 20%, $125K or More: 10%",
            medianIncome: "$52,985",
            populationDensity: "63.2 / sq. mi.",
            povertyRate: "19.7%",
            politicalLean: "Republican",
            numDistricts: 4,
            numPrecincts: 1911,
            congressionalRepresentation: ["Democratic: 1 Representative", "Republican: 3 Representatives"],
        },
    };

    const currentSummary = summaryData[currentState];

    const handleMouseOver = (event) => {
        Object.assign(event.target.style, hoverStyle);
    };

    const handleMouseOut = (event) => {
        Object.assign(event.target.style, tabStyle); // Reset back to original style
    };

    return (
        <>
            <div style={summaryContainerStyle}>
                <h3 style={titleStyle}>State Overview Summary</h3>
                <div style={rowContainerStyle}>
                    <div style={sectionStyle}>
                        <h4 style={sectionTitleStyle}>Population</h4>
                        <p style={itemStyle}>Total: {currentSummary.totalPopulation}</p>
                        <p style={itemStyle}>Voting: {currentSummary.votingAgePopulation}</p>
                        <p style={itemStyle}>Density: {currentSummary.populationDensity}</p>
                    </div>
                    <div style={sectionStyle}>
                        <h4 style={sectionTitleStyle}>Region Types</h4>
                        {currentSummary.regionTypeDistribution.map((item, index) => (
                            <p key={index} style={itemStyle}>{item}</p>
                        ))}
                    </div>
                    <div style={sectionStyle}>
                        <h4 style={sectionTitleStyle}>Congressional</h4>
                        {currentSummary.congressionalRepresentation.map((item, index) => (
                            <p key={index} style={itemStyle}>{item}</p>
                        ))}
                        <h4 style={sectionTitleStyle}>Redistricting</h4>
                        <p style={itemStyle}>{currentSummary.redistrictingControl}</p>
                    </div>
                    <div style={sectionStyle}>
                        <h4 style={sectionTitleStyle}>Additional Info</h4>
                        <p style={itemStyle}>Median Income: {currentSummary.medianIncome}</p>
                        <p style={itemStyle}>Poverty Rate: {currentSummary.povertyRate}</p>
                        <p style={itemStyle}>Lean: {currentSummary.politicalLean}</p>
                        <p style={itemStyle}>Districts: {currentSummary.numDistricts}</p>
                        <p style={itemStyle}>Precincts: {currentSummary.numPrecincts}</p>
                    </div>
                </div>
            </div>

            {/* Chart Section */}
            {selectedSubCategory !== 'CD Representation' && (
                <div style={{
                    display: 'flex',
                    gap: '12px',
                    marginTop: '16px',
                    width: '100%',
                    height: 'calc(100vh - 300px)',
                    minHeight: '500px',
                }}>
                    {/* Left column — Votes */}
                    <div style={{ ...chartContainerStyleVoting, flex: '0 0 30%' }}>
                        {currentState === 'Mississippi' ? <MississippiVotesChart /> : <ConnecticutVotesChart />}
                    </div>

                    {/* Right column — Income stacked above Race */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        flex: '1',
                        minHeight: 0,
                    }}>
                        <div style={{ ...chartContainerStyle, flex: '1', minHeight: 0 }}>
                            {currentState === 'Mississippi' ? <IncomeDataMS /> : <IncomeDataCT />}
                        </div>
                        <div style={{ ...chartContainerStyleRace, flex: '1.4', minHeight: 0 }}>
                            {currentState === 'Mississippi' ? <RaceDistributionMS /> : <RaceDistributionCT />}
                        </div>
                    </div>
                </div>
            )}

            {selectedSubCategory === 'CD Representation' && (
                <div style={{ marginTop: '20px' }}>
                    <CongressionalRepresentation currentState={currentState} childSetDistrictHighlighted={childSetDistrictHighlighted} />
                </div>
            )}
        </>
    );
};

// Styling for the layout and components
const summaryContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid rgba(255,255,255,0.1)',
    fontFamily: 'Inter, Arial, sans-serif',
    borderRadius: '14px',
    fontSize: '13px',
    lineHeight: '1.5',
    color: 'rgba(255,255,255,0.85)',
    width: '100%',
    background: 'rgba(0,0,0,0.25)',
    overflow: 'hidden',
    boxSizing: 'border-box',
};

const titleStyle = {
    textAlign: 'center',
    margin: '14px 0 10px',
    fontWeight: '700',
    fontSize: '15px',
    color: '#80cbc4',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
};

const rowContainerStyle = {
    display: 'flex',
    flexWrap: 'nowrap',
    justifyContent: 'stretch',
    gap: '0px',
    overflowX: 'auto',
    borderTop: '1px solid rgba(255,255,255,0.08)',
};

const sectionStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '10px 12px',
    borderRight: '1px solid rgba(255,255,255,0.07)',
    flex: 1,
    minWidth: '120px',
};

const sectionTitleStyle = {
    fontWeight: '700',
    marginBottom: '6px',
    fontSize: '11px',
    textAlign: 'center',
    marginTop: '0px',
    color: '#80cbc4',
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
};

const itemStyle = {
    margin: '2px 0',
    fontSize: '12px',
    lineHeight: '1.4',
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
};

const chartCardStyle = {
    background: 'rgba(0,0,0,0.2)',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.07)',
    overflow: 'hidden',
};

const chartContainerStyle = {
    ...chartCardStyle,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
};

const chartContainerStyleVoting = {
    ...chartCardStyle,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
};

const chartContainerStyleRace = {
    ...chartCardStyle,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
};

export default StateOverview;
