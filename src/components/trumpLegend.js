import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const TrumpHeatmapLegend = () => {
    const trumpColors = [
        { range: '0% - 10%', color: '#e8ddd8' },
        { range: '11% - 20%', color: '#fee0d2' },
        { range: '21% - 30%', color: '#fcbba1' },
        { range: '31% - 40%', color: '#fc9272' },
        { range: '41% - 50%', color: '#fb6a4a' },
        { range: '51% - 60%', color: '#ef3b2c' },
        { range: '61% - 70%', color: '#cb181d' },
        { range: '71% - 80%', color: '#a50f15' },
        { range: '81% - 90%', color: '#67000d' },
        { range: '91% - 100%', color: '#420109' },
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
                Percentage Range
            </Typography>
            <Box>
                {trumpColors.map(({ range, color }) => (
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

export default TrumpHeatmapLegend;
