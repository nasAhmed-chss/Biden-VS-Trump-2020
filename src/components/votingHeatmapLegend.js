import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const VotingHeatmapLegend = () => {
    const votingRanges = [
        { range: 'Republican ≥ 90%', color: '#4B0000' },
        { range: '75% - 89%', color: '#8B0000' },
        { range: '60% - 74%', color: '#B22222' },
        { range: '45% - 59%', color: '#CD5C5C' },
        { range: '< 45%', color: '#F08080' },
        { range: '< 45%', color: '#ADD8E6' },
        { range: '45% - 59%', color: '#87CEEB' },
        { range: '60% - 74%', color: '#4169E1' },
        { range: '75% - 89%', color: '#0000CD' },
        { range: 'Democrat ≥ 90%', color: '#00008B' },
    ];

    return (
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
                Votes Range
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
    );
};

export default VotingHeatmapLegend;