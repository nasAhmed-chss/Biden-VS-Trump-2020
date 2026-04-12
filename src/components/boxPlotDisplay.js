import React, { useState } from "react";
import GetMSEnsembleData from "./MS_Ensemble_BoxPlot";

const BoxPlotDisplay = ({ currentState }) => {
    const [selectedType, setSelectedType] = useState("Race");
    const [selectedOption, setSelectedOption] = useState("white"); // Single state for dropdown options
    const [showRegionType, setShowRegionType] = useState(false);

    // Styles
    const outerStyle = {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        gap: "16px",
        paddingTop: "4px",
    };

    const pageTitleStyle = {
        margin: "0 0 4px",
        fontFamily: "Inter, Arial, sans-serif",
        fontSize: "1.4rem",
        fontWeight: "700",
        color: "#80cbc4",
        letterSpacing: "0.03em",
        textAlign: "center",
    };

    const controlsRowStyle = {
        display: "flex",
        flexDirection: "row",
        gap: "20px",
        alignItems: "flex-end",
        justifyContent: "center",
        flexWrap: "wrap",
        background: "rgba(0,0,0,0.2)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "12px",
        padding: "14px 20px",
        width: "100%",
        boxSizing: "border-box",
    };

    const controlGroupStyle = {
        display: "flex",
        flexDirection: "column",
        gap: "6px",
    };

    const dropdownStyle = {
        padding: "8px 32px 8px 12px",
        border: "1px solid rgba(255,255,255,0.15)",
        borderRadius: "8px",
        fontSize: "13px",
        background: "#036060",
        color: "white",
        cursor: "pointer",
        outline: "none",
        fontFamily: "Inter, Arial, sans-serif",
        fontWeight: "500",
        appearance: "none",
    };

    const labelStyle = {
        fontWeight: "600",
        fontSize: "11px",
        color: "rgba(255,255,255,0.5)",
        letterSpacing: "0.07em",
        textTransform: "uppercase",
        fontFamily: "Inter, Arial, sans-serif",
    };

    const chartCardStyle = {
        width: "100%",
        background: "rgba(0,0,0,0.2)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "14px",
        padding: "12px",
        boxSizing: "border-box",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
    };

    // Table styles
    const tableContainerStyle = {
        width: "100%",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "12px",
        fontFamily: "Inter, Arial, sans-serif",
        overflow: "hidden",
        background: "rgba(0,0,0,0.2)",
    };

    const tableStyle = {
        width: "100%",
        borderCollapse: "collapse",
    };

    const thTdStyle = {
        padding: "10px 12px",
        textAlign: "center",
        fontSize: "13px",
        color: "rgba(255,255,255,0.7)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
    };

    const thStyle = {
        ...thTdStyle,
        background: "rgba(0,60,60,0.8)",
        fontWeight: "700",
        fontSize: "11px",
        color: "rgba(255,255,255,0.8)",
        letterSpacing: "0.06em",
        textTransform: "uppercase",
    };

    // Handle dropdown change for Type and reset second dropdown
    const handleTypeChange = (value) => {
        setSelectedType(value);
        setSelectedOption(value === "Race" ? "white" : "low"); // Reset to default for new type
    };

    return (
        <div style={outerStyle}>
            <h1 style={pageTitleStyle}>Ensemble Plan</h1>

            {/* Controls row */}
            <div style={controlsRowStyle}>
                <div style={controlGroupStyle}>
                    <label style={labelStyle}>Type</label>
                    <select
                        value={selectedType}
                        onChange={(e) => handleTypeChange(e.target.value)}
                        style={dropdownStyle}
                    >
                        <option value="Race">Race</option>
                        <option value="Income">Income</option>
                    </select>
                </div>

                <div style={controlGroupStyle}>
                    <label style={labelStyle}>
                        {selectedType === "Race" ? "Racial/Ethnic Group" : "Income Group"}
                    </label>
                    <select
                        value={selectedOption}
                        onChange={(e) => setSelectedOption(e.target.value)}
                        style={dropdownStyle}
                    >
                        {selectedType === "Race" ? (
                            <>
                                <option value="white">White</option>
                                <option value="black">Black</option>
                                <option value="asian">Asian</option>
                                <option value="hispanic">Hispanic or Latino</option>
                                <option value="other">Other</option>
                            </>
                        ) : (
                            <>
                                <option value="low">Low Income</option>
                                <option value="middle">Middle Income</option>
                                <option value="high">High Income</option>
                            </>
                        )}
                    </select>
                </div>
            </div>

            {/* Chart card */}
            <div style={chartCardStyle}>
                <GetMSEnsembleData race={selectedOption} showRegionType={showRegionType} />
            </div>

            {/* Ensemble table */}
            <div style={tableContainerStyle}>
                <table style={tableStyle}>
                    <thead>
                        <tr>
                            <th style={thStyle}>Ensemble</th>
                            <th style={thStyle}>Num of District Plans</th>
                            <th style={thStyle}>Population Equality Threshold</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={thTdStyle}>1</td>
                            <td style={thTdStyle}>250</td>
                            <td style={thTdStyle}>0.5</td>
                        </tr>
                        <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                            <td style={thTdStyle}>2</td>
                            <td style={thTdStyle}>5000</td>
                            <td style={thTdStyle}>0.5</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BoxPlotDisplay;
