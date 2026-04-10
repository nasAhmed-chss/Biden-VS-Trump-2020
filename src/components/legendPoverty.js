import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const PovertyHeatmapLegend = () => {
    const povertyRanges = [
        { range: '< 5%', color: '#fff7f3' },
        { range: '5% - 10%', color: '#d7b5d8' },
        { range: '10% - 15%', color: '#df65b0' },
        { range: '15% - 20%', color: '#dd1c77' },
        { range: '> 20%', color: '#980043' },
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
                Poverty Range
            </Typography>
            <Box>
                {povertyRanges.map(({ range, color }) => (
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

export default PovertyHeatmapLegend;
