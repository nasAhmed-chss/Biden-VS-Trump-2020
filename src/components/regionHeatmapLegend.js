import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const RegionHeatmapLegend = () => {
    const regionTypes = [
        { type: 'Rural', color: '#e7e1ef' },
        { type: 'Suburban', color: '#c994c7' },
        { type: 'Urban', color: '#dd1c77' },
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
                Region Type
            </Typography>
            <Box>
                {regionTypes.map(({ type, color }) => (
                    <Box
                        key={type}
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
                        <Typography variant="body2">{type}</Typography>
                    </Box>
                ))}
            </Box>
        </Paper>
    );
};

export default RegionHeatmapLegend;
