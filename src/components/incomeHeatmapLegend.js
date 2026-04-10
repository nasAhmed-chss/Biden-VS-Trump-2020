import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const IncomeHeatmapLegend = () => {
    const incomeRanges = [
        { range: '< $30,000', color: '#e5f5e0' },
        { range: '$30,000 - $45,000', color: '#c7e9c0' },
        { range: '$45,000 - $60,000', color: '#a1d99b' },
        { range: '$60,000 - $75,000', color: '#74c476' },
        { range: '$75,000 - $90,000', color: '#41ab5d' },
        { range: '$90,000 - $105,000', color: '#238b45' },
        { range: '$105,000 - $120,000', color: '#006d2c' },
        { range: '$120,000 - $135,000', color: '#00441b' },
        { range: '$135,000 - $150,000', color: '#002611' },
        { range: '> $150,000', color: '#001208' },
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
                Income Range
            </Typography>
            <Box>
                {incomeRanges.map(({ range, color }) => (
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

export default IncomeHeatmapLegend;
