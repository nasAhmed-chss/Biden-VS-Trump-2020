import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';

const RaceHeatmapLegend = ({ currentRace, setCurrentRace }) => {
    console.log("what i first got: ", currentRace);

    const whiteColors = [
        { range: '0% - 10%', color: '#ffffcc' },
        { range: '11% - 20%', color: '#ffeda0' },
        { range: '21% - 30%', color: '#fed976' },
        { range: '31% - 40%', color: '#feb24c' },
        { range: '41% - 50%', color: '#fd8d3c' },
        { range: '51% - 60%', color: '#fc4e2a' },
        { range: '61% - 70%', color: '#e31a1c' },
        { range: '71% - 80%', color: '#bd0026' },
        { range: '81% - 90%', color: '#800026' },
        { range: '91% - 100%', color: '#2e000e' },
    ];

    const blackColors = [
        { range: '0% - 10%', color: '#ffffd9' },
        { range: '11% - 20%', color: '#edf8b1' },
        { range: '21% - 30%', color: '#c7e9b4' },
        { range: '31% - 40%', color: '#7fcdbb' },
        { range: '41% - 50%', color: '#41b6c4' },
        { range: '51% - 60%', color: '#1d91c0' },
        { range: '61% - 70%', color: '#225ea8' },
        { range: '71% - 80%', color: '#253494' },
        { range: '81% - 90%', color: '#081d58' },
        { range: '91% - 100%', color: '#081d58' },
    ];

    const asianColors = [
        { range: '0% - 10%', color: '#fff7f3' },
        { range: '11% - 20%', color: '#fde0dd' },
        { range: '21% - 30%', color: '#fcc5c0' },
        { range: '31% - 40%', color: '#fa9fb5' },
        { range: '41% - 50%', color: '#f768a1' },
        { range: '51% - 60%', color: '#dd3497' },
        { range: '61% - 70%', color: '#ae017e' },
        { range: '71% - 80%', color: '#7a0177' },
        { range: '81% - 90%', color: '#49006a' },
        { range: '91% - 100%', color: '#49006a' },
    ];

    const hispanicColors = [
        { range: '0% - 10%', color: '#ffffe5' },
        { range: '11% - 20%', color: '#f7fcb9' },
        { range: '21% - 30%', color: '#d9f0a3' },
        { range: '31% - 40%', color: '#addd8e' },
        { range: '41% - 50%', color: '#78c679' },
        { range: '51% - 60%', color: '#41ab5d' },
        { range: '61% - 70%', color: '#238443' },
        { range: '71% - 80%', color: '#006837' },
        { range: '81% - 90%', color: '#004529' },
        { range: '91% - 100%', color: '#004529' },
    ];

    const colorMap = {
        White: whiteColors,
        Black: blackColors,
        Hispanic: hispanicColors,
        Asian: asianColors,
    };

    const votingRanges = colorMap[currentRace];
    console.log("the current race is:", currentRace);
    console.log("the voting range is:", votingRanges);

    const races = [
        { race: 'White', color: '#bd0026' },
        { race: 'Black', color: '#253494' },
        { race: 'Hispanic', color: '#006837' },
        { race: 'Asian', color: '#7a0177' },
    ];

    const handleClick = (race) => {
        setCurrentRace(race);
    };

    return (
        <>
            <Paper
                elevation={3}
                style={{
                    marginTop: '5px',
                    padding: '5px',
                    width: '95%',
                    backgroundColor: '#f0f0f0',
                }}
            >
                <Typography variant="h6" align="center" gutterBottom>
                    Race Density
                </Typography>
                <Box>
                    {votingRanges.map(({ range, color }) => (
                        <Box
                            key={range}
                            display="flex"
                            alignItems="center"
                            marginBottom="5px"
                        >
                            <Box
                                style={{
                                    backgroundColor: color,
                                    width: '15px',
                                    height: '15px',
                                    marginRight: '10px',
                                }}
                            />
                            <Typography variant="body2">{range}</Typography>
                        </Box>
                    ))}
                </Box>
            </Paper>

            <Paper
                elevation={3}
                style={{
                    padding: '5px',
                    margin: '5px',
                    width: '95%',
                    backgroundColor: '#f0f0f0',
                }}
            >
                <Typography variant="h6" align="center" gutterBottom>
                    Races
                </Typography>
                <Box>
                    {races.map(({ race, color }) => (
                        <Box
                            key={race}
                            display="flex"
                            alignItems="center"
                            marginBottom="5px"
                        >
                            <Box
                                style={{
                                    backgroundColor: color,
                                    width: '10px',
                                    height: '10px',
                                    marginRight: '10px',
                                }}
                            />
                            <Button
                                variant="contained"
                                onClick={() => handleClick(race)}
                                style={{
                                    textTransform: 'none',
                                    fontSize: '14px',
                                    backgroundColor: '#f0f0f0',
                                    color: '#333',
                                    transition: 'background-color 0.3s ease',
                                    height: '15px'
                                }}
                                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#d3d3d3')}
                                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
                            >
                                {race}
                            </Button>
                        </Box>
                    ))}
                </Box>
            </Paper>
        </>
    );
};


export default RaceHeatmapLegend;