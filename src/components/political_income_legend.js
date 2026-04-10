import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';


// Adjusts the hue of an HSL color by a given increment
function adjustHue(hslColor, increment) {
    const regex = /hsl\(([-\d.]+),\s*([\d.]+%)\s*,\s*([\d.]+%)\)/;
    const match = hslColor.match(regex);

    if (match) {
        let hue = parseFloat(match[1]);
        const saturation = match[2];
        const lightness = match[3];

        // Adjust the hue
        hue = (hue + increment) % 360;
        if (hue < 0) hue += 360; // Wrap around for negative values

        return `hsl(${hue}, ${saturation}, ${lightness})`;
    } else {
        throw new Error("Invalid HSL color format");
    }
}

const PoliticalIncomeHeatmapLegend = () => {
    const polincColors = [
        { range: 'Republican ≥ 90%', color: 'hsl(0, 100%, 14.71%)' },
        { range: '75% - 89%', color: 'hsl(0, 100%, 27.25%)' },
        { range: '60% - 74%', color: 'hsl(0, 67.92%, 41.57%)' },
        { range: '45% - 59%', color: 'hsl(0, 53.05%, 58.24%)' },
        { range: '< 45%', color: 'hsl(0, 78.87%, 72.16%)' },
        { range: '< 45%', color: 'hsl(194.74, 53.27%, 79.02%)' },
        { range: '45% - 59%', color: 'hsl(197.4, 71.43%, 72.55%)' },
        { range: '60% - 74%', color: 'hsl(225, 72.73%, 56.86%)' },
        { range: '75% - 89%', color: 'hsl(240, 100%, 40.2%)' },
        { range: 'Democrat ≥ 90%', color: 'hsl(240, 100%, 27.25%)' },
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
                Color Range
            </Typography>
            <Box position="relative">
                <Box>
                    <Typography variant="body2" style={{ marginBottom: '5px' }}>
                        Republican
                    </Typography>
                    <Typography variant="body2" style={{ marginBottom: '5px' }}>
                        Low <ArrowRightAltIcon />  High Income
                    </Typography>
                    {polincColors.map(({ range, color }) => (
                        <Box key={range} marginBottom="10px">
                            <Box display="flex" justifyContent="space-between" gap="5px">
                                {[-20, -10, 0, 10, 20].map((increment) => (
                                    <Box
                                        key={increment}
                                        style={{
                                            backgroundColor: adjustHue(color, increment),
                                            width: '20px',
                                            height: '20px',
                                        }}
                                    />
                                ))}
                            </Box>
                        </Box>
                    ))}
                    <Typography variant="body2" style={{ marginBottom: '5px' }}>
                        Low <ArrowRightAltIcon />  High Income
                    </Typography>
                    <Typography variant="body2" style={{ marginBottom: '5px' }}>
                        Democratic
                    </Typography>
                </Box>
            </Box>
        </Paper>
    );
};

export default PoliticalIncomeHeatmapLegend;
