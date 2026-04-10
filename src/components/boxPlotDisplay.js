import React, { useState } from "react";
import GetMSEnsembleData from "./MS_Ensemble_BoxPlot";

const BoxPlotDisplay = ({ currentState }) => {
    const [selectedType, setSelectedType] = useState("Race");
    const [selectedOption, setSelectedOption] = useState("white"); // Single state for dropdown options
    const [showRegionType, setShowRegionType] = useState(false);

    // Styles
    const containerStyle = {
        display: "flex",
        flexDirection: "row",
        gap: "20px",
        alignItems: "center",
        justifyContent: "center",
        margin: "20px 0",
        border: "1px solid #ddd",  // Thin light gray border
        borderRadius: "8px",       // Optional: Rounded corners
        padding: "15px",           // Optional: Internal spacing
        backgroundColor: "#fff",   // Optional: Background color
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)", // Optional: Subtle shadow for depth
    };



    const dropdownStyle = {
        padding: "8px 12px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        fontSize: "14px",
        backgroundColor: "white",
        color: "#333",
        cursor: "pointer",
        outline: "none",
    };

    const labelStyle = {
        fontWeight: "bold",
        fontSize: "14px",
        color: "#333",
        marginRight: "10px",
        fontFamily: '"Arial", sans-serif'
    };
    // Table styles
    const tableContainerStyle = {
        width: "100%",
        margin: "20px auto",
        border: "1px solid #ddd",
        borderRadius: "8px",
        fontFamily: "Arial, sans-serif",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#fff",
    };

    const tableStyle = {
        width: "100%",
        borderCollapse: "collapse",
        fontFamily: "Arial, sans-serif",

    };

    const thTdStyle = {
        border: "1px solid #ddd",
        padding: "10px",
        textAlign: "center",
        fontFamily: "Arial, sans-serif",

    };

    const thStyle = {
        ...thTdStyle,
        backgroundColor: "#f8f9fa",
        fontWeight: "bold",
        color: "#333",
        fontFamily: "Arial, sans-serif",

    };

    // Handle dropdown change for Type and reset second dropdown
    const handleTypeChange = (value) => {
        setSelectedType(value);
        setSelectedOption(value === "Race" ? "white" : "low"); // Reset to default for new type
    };

    return (
        <div style={{ textAlign: "center", marginTop: '-10%' }}>
            <h1 style={{ fontFamily: "Arial, sans-serif" }}>Ensemble Plan</h1>
            <div style={containerStyle}>
                {/* Dropdown for Type */}
                <div>
                    <label style={labelStyle}>Type:</label>
                    <select
                        value={selectedType}
                        onChange={(e) => handleTypeChange(e.target.value)}
                        style={dropdownStyle}
                    >
                        <option value="Race">Race</option>
                        <option value="Income">Income</option>
                    </select>
                </div>

                {/* Dynamic Dropdown for Race or Income */}
                <div>
                    <label style={labelStyle}>
                        {selectedType === "Race"
                            ? "Show Racial/Ethnic Group:"
                            : "Show Income Group:"}
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
                                <option value="hispanic">
                                    Hispanic or Latino (of any race)
                                </option>
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

            {/* Example Chart Rendering */}
            <div style={containerStyle}>

                <GetMSEnsembleData race={selectedOption} showRegionType={showRegionType} />
            </div>
            <div style={tableContainerStyle}>
                <table style={tableStyle}>
                    <thead>
                        <tr>
                            <th style={thStyle}>ENSEMBLE</th>
                            <th style={thStyle}>NUM OF DISTRICT PLANS</th>
                            <th style={thStyle}>POPULATION EQUALITY THRESHOLD</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={thTdStyle}>1</td>
                            <td style={thTdStyle}>250</td>
                            <td style={thTdStyle}>0.5</td>
                        </tr>
                        <tr>
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
