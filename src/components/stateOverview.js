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
                <>
                    {/* Top Row Charts */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: '10px',
                        marginTop: '20px',
                        height: '35%',
                    }}>
                        <div style={chartContainerStyleVoting}>
                            {currentState === 'Mississippi' ? <MississippiVotesChart /> : <ConnecticutVotesChart />}
                        </div>
                        <div style={chartContainerStyle}>
                            {currentState === 'Mississippi' ? <IncomeDataMS /> : <IncomeDataCT />}
                        </div>
                    </div>

                    {/* Bottom Row Chart */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginTop: '5px',
                        height: "35%"
                    }}>
                        <div style={chartContainerStyleRace}>
                            {currentState === 'Mississippi' ? <RaceDistributionMS /> : <RaceDistributionCT />}
                        </div>
                    </div>
                </>
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
    border: '1px solid rgba(0, 0, 0, 0.2)',
    fontFamily: '"Arial", sans-serif',
    borderRadius: '6px',
    fontSize: '14px',
    lineHeight: '1.4',
    color: '#333',
    width: '99.5%',
    backgroundColor: '#f8f8f8',
};

const titleStyle = {
    textAlign: 'center',
    marginBottom: '10px',
    fontWeight: 'bold',
    fontSize: '18px',
    color: '#222',
};

const horizontalContainerStyle = {
    display: 'flex',
    //flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: '5px',
};

const rowContainerStyle = {
    display: 'flex',
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
    gap: '5px',
    overflowX: 'auto', // Allow horizontal scrolling if needed
};

const sectionStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center', // Center the title horizontally
    backgroundColor: '#ffffff',
    borderRadius: '4px',
    padding: '8px 10px', // Reduce top and bottom padding
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
    minWidth: '150px',
    maxWidth: '200px',
    flexGrow: 1,
};

const sectionTitleStyle = {
    fontWeight: 'bold',
    marginBottom: '5px',
    fontSize: '14px', // Adjust font size if needed
    textAlign: 'center', // Center align the text
    marginTop: '0px', // Remove extra space at the top
    paddingTop: '5px', // Add minimal padding for better spacing
    color: '#444',
};

const itemStyle = {
    margin: '2px 0', // Reduce spacing between items
    fontSize: '14px', // Slightly smaller font size
    lineHeight: '1.2', // Reduce line spacing
};

const chartContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center', // Center individual charts horizontally
    justifyContent: 'center',
    width: '100%',
    height: '100%'

};

const chartContainerStyleVoting = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center', // Center individual charts horizontally
    justifyContent: 'center',
    width: '100%',
    height: '100%'

};

const chartContainerStyleRace = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center', // Center individual charts horizontally
    justifyContent: 'center',
    width: '100%',
    height: '100%'

};

export default StateOverview;
