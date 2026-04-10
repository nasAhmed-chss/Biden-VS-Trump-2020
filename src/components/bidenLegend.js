import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const BidenHeatmapLegend = () => {
    const bidenColors = [
        { range: '0% - 10%', color: '#e1e8ed' },
        { range: '11% - 20%', color: '#deebf7' },
        { range: '21% - 30%', color: '#c6dbef' },
        { range: '31% - 40%', color: '#9ecae1' },
        { range: '41% - 50%', color: '#6baed6' },
        { range: '51% - 60%', color: '#4292c6' },
        { range: '61% - 70%', color: '#2171b5' },
        { range: '71% - 80%', color: '#08519c' },
        { range: '81% - 90%', color: '#08306b' },
        { range: '91% - 100%', color: '#041b3d' },
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
                {bidenColors.map(({ range, color }) => (
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

export default BidenHeatmapLegend;
