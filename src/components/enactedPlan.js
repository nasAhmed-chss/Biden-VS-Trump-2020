import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    ResponsiveContainer,
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";
import { Box, Typography } from "@mui/material";

const RacePopulationScatter = ({ raceType }) => {
    const [chartData, setChartData] = useState([]);
    const [maxValue, setMaxValue] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            const filePath = "data/Mississippi_Master_Data.geojson"; // Replace with the correct file path
            try {
                const response = await axios.get(filePath);

                // Extract the list of districts
                const districts = response.data.features.districts;
                console.log("the districts: ", districts);

                // Transform data into scatter plot format
                const transformedData = districts.map((district) => {
                    const racePopulation = district[raceType]; // Get population percentage for the race
                    return {
                        district: district.DISTRICT || `District ${district.id}`, // Add district name or fallback
                        value: racePopulation, // Use the population percentage directly
                    };
                });

                // Determine the maximum value for the Y-axis
                const maxVal = Math.max(...transformedData.map((item) => item.value));
                setMaxValue(maxVal);

                setChartData(transformedData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [raceType]);

    return (
        <Box style={{ margin: "20px" }}>
            <Typography variant="h6" align="center" gutterBottom>
                Population Percentage for {raceType.replace("_", " ")}
            </Typography>

            <ResponsiveContainer width="100%" height={400}>
                <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="district"
                        type="category"
                        label={{ value: "Districts", position: "insideBottom", offset: -10 }}
                    />
                    <YAxis
                        type="number"
                        domain={[0, Math.ceil(maxValue)]}
                        label={{
                            value: "Population Percentage (%)",
                            angle: -90,
                            position: "insideLeft",
                        }}
                    />
                    <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                    <Scatter
                        name={raceType.replace("_", " ")}
                        data={chartData}
                        fill="#8884d8"
                    />
                </ScatterChart>
            </ResponsiveContainer>
        </Box>
    );
};

export default RacePopulationScatter;
