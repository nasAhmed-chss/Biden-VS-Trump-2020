import { useState, useEffect } from 'react';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import IconButton from '@mui/material/IconButton';
import UndoIcon from '@mui/icons-material/Undo';
import MapIcon from '@mui/icons-material/Map';
import { color } from 'd3';

let map;

export default function Map({ setZoomToMississippi, setZoomToConnecticut, setResetView, currentState,
    setCurrentState, isZoomed, setIsZoomed, setHandleheatmaps, setHeatmapOn, heatmapOn, setCurrentHeatmap,
    currentHeatmap, setCurrentRace, currentRace, setHeatmapAuto, heatmapAuto, onSetDistrictHighlighted, handleReset }) {
    const [zoomPercentage, setZoomPercentage] = useState('100%');
    const [showButtons, setShowButtons] = useState(false);
    const [districtType, setDistrictType] = useState('cd');
    const [layers, setLayers] = useState([]);
    const [tileLayerUrl, setTileLayerUrl] = useState('https://api.maptiler.com/maps/basic-v2/{z}/{x}/{y}@2x.png?key=FeDzWVWfp7RNYDWeMMP8');
    const [hoveredName, setHoveredName] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [districtSummary, setDistrictSummary] = useState(null);
    const [districtHighlighted, setDistrictHighlighted] = useState(null);


    const heatmapOpacity = 0.75;
    const normalOpacity = 0.25;
    const heatmapMouseOver = 0.9;
    const normalMouseOver = 0.5;
    const mouseOverWeight = 1;
    const mouseOutWeight = 0.5;

    const handleRaceHeatmapColor = (racePop, totalPop) => {
        if (racePop == 0) {
            return RaceColors[currentRace][`${currentRace}${10}`] || 'grey';
        }
        const percentage = Math.ceil((racePop / totalPop) * 10) * 10;
        return RaceColors[currentRace][`${currentRace}${percentage}`] || 'grey';
    };

    // Function to switch tile layers
    const toggleTileLayer = () => {
        setTileLayerUrl(prevUrl =>
            prevUrl.includes('streets-v2-dark')
                ? 'https://api.maptiler.com/maps/basic-v2/{z}/{x}/{y}@2x.png?key=FeDzWVWfp7RNYDWeMMP8'
                : 'https://api.maptiler.com/maps/streets-v2-dark/{z}/{x}/{y}@2x.png?key=FeDzWVWfp7RNYDWeMMP8'
        );
    };

    const handleCombinedClick = () => {
        handleResetView();
        toggleTileLayer();
    };

    const loadDistrictData = async (districtType, state) => {

        let fileName = '';
        setDistrictType(districtType);

        if (Array.isArray(layers)) {
            layers.forEach(layer => {
                map.removeLayer(layer);
            });
        }

        // const response = await axios.get(`http://localhost:8080/api/data/${state}/Master_Data`);
        // fileName = response.data;

        if (state === "Mississippi") {
            fileName = "data/Mississippi_Master_Data.geojson";
        } else if (state = "Connecticut") {
            fileName = "data/Connecticut_Master_Data.geojson";
        }

        setLayers([]);

        axios.get(fileName)
            .then((response) => {
                //console.log("response: ", response);
                let responseData;
                if (districtType === 'cd') {
                    responseData = response.data.features.districts;
                } else if (districtType === 'precinct') {
                    responseData = response.data.features.precincts;
                }
                //console.log("responsedata: ", responseData);
                if (map) {
                    map.eachLayer((layer) => {
                        map.removeLayer
                    });
                    const newLayer = L.geoJSON(responseData, {
                        style: (feature) => {
                            let fillColor = 'grey';

                            if (!heatmapOn) {
                                fillColor = 'grey';
                            } else if (currentHeatmap === 'Voting/Electoral Heatmap') {
                                const totalVotes = feature.properties.G20PRERTRU + feature.properties.G20PREDBID;
                                const republicanVotes = feature.properties.G20PRERTRU;
                                const democraticVotes = feature.properties.G20PREDBID;
                                const republicanPercentage = (republicanVotes / totalVotes) * 100;
                                const democraticPercentage = (democraticVotes / totalVotes) * 100;

                                if (republicanPercentage > democraticPercentage) {
                                    const leadPercentage = republicanPercentage;
                                    if (leadPercentage >= 90) fillColor = '#4B0000';
                                    else if (leadPercentage >= 75) fillColor = '#8B0000';
                                    else if (leadPercentage >= 60) fillColor = '#B22222';
                                    else if (leadPercentage >= 45) fillColor = '#CD5C5C';
                                    else fillColor = '#F08080';
                                } else {
                                    const leadPercentage = democraticPercentage;
                                    if (leadPercentage >= 90) fillColor = '#00008B';
                                    else if (leadPercentage >= 75) fillColor = '#0000CD';
                                    else if (leadPercentage >= 60) fillColor = '#4169E1';
                                    else if (leadPercentage >= 45) fillColor = '#87CEEB';
                                    else fillColor = '#ADD8E6';
                                }
                            } else if (currentHeatmap === 'Income Heatmap') {
                                const income = feature.properties.MEDN_INC22;
                                fillColor = getIncomeColor(income);
                            } else if (currentHeatmap === 'Race Heatmap') {
                                const whitePop = feature.properties.WHT_NHSP22;
                                const blackPop = feature.properties.BLK_NHSP22;
                                const hispanicPop = feature.properties.HSP_POP22;
                                const asianPop = feature.properties.ASN_NHSP22;
                                const otherPop = feature.properties.OTH_NHSP22;
                                const totalPop = feature.properties.TOT_POP22;
                                if (currentRace === 'White') fillColor = handleRaceHeatmapColor(whitePop, totalPop);
                                else if (currentRace === 'Black') fillColor = handleRaceHeatmapColor(blackPop, totalPop);
                                else if (currentRace === 'Hispanic') fillColor = handleRaceHeatmapColor(hispanicPop, totalPop);
                                else if (currentRace === 'Asian') fillColor = handleRaceHeatmapColor(asianPop, totalPop);
                                else if (currentRace === 'Other') fillColor = handleRaceHeatmapColor(otherPop, totalPop);
                                else fillColor = 'grey';
                            } else if (currentHeatmap === 'Region Heatmap') {
                                const region = feature.properties.category;
                                fillColor = getRegionColor(region);
                            } else if (currentHeatmap === 'Poverty Heatmap') {
                                const region = feature.properties.PCT_BELOW_POVERTY;
                                fillColor = getPovertyColor(region);
                            } else if (currentHeatmap === 'Political/Income Heatmap') {
                                const totalVotes = feature.properties.G20PRERTRU + feature.properties.G20PREDBID;
                                const republicanVotes = feature.properties.G20PRERTRU;
                                const democraticVotes = feature.properties.G20PREDBID;
                                const republicanPercentage = (republicanVotes / totalVotes) * 100;
                                const democraticPercentage = (democraticVotes / totalVotes) * 100;
                                const income = feature.properties.MEDN_INC22;
                                fillColor = getPolIncColor(republicanPercentage, democraticPercentage, income);
                            } else if (currentHeatmap === 'Trump Heatmap') {
                                const totalVotes = feature.properties.G20PRERTRU + feature.properties.G20PREDBID;
                                const republicanVotes = feature.properties.G20PRERTRU;
                                const republicanPercentage = (republicanVotes / totalVotes) * 100;
                                fillColor = getTrumpColor(republicanPercentage);
                            } else if (currentHeatmap === 'Biden Heatmap') {
                                const totalVotes = feature.properties.G20PRERTRU + feature.properties.G20PREDBID;
                                const democraticVotes = feature.properties.G20PREDBID;
                                const democraticPercentage = (democraticVotes / totalVotes) * 100;
                                fillColor = getBidenColor(democraticPercentage);
                            }
                            // if (districtHighlighted == feature.properties.District || districtHighlighted == feature.properties.DISTRICT) {
                            //     return {
                            //         color: 'grey',
                            //         weight: mouseOverWeight,
                            //         fillOpacity: heatmapOn ? heatmapMouseOver : normalMouseOver,
                            //     };
                            // } else {
                            //     return {
                            //         color: fillColor,
                            //         weight: mouseOverWeight,
                            //         fillOpacity: heatmapOn ? heatmapOpacity : normalOpacity,
                            //     };
                            // }
                            if ((districtHighlighted == feature.properties.District || districtHighlighted == feature.properties.DISTRICT) && (districtType === 'cd')) {
                                return {
                                    color: fillColor,
                                    weight: mouseOverWeight,
                                    fillOpacity: heatmapOn ? heatmapMouseOver : normalMouseOver,
                                };
                            } else {
                                return {
                                    color: fillColor,
                                    weight: mouseOverWeight,
                                    fillOpacity: heatmapOn ? heatmapOpacity : normalOpacity,
                                };
                            }
                        },
                        onEachFeature: (feature, layer) => {
                            layer.on({
                                mouseover: () => {
                                    const originalColor = layer.options.color;
                                    setHoveredName('');
                                    if (districtType === 'cd') {
                                        const displayName = `District ${feature.properties.District || feature.properties.DISTRICT || 'Unknown'}`;
                                        setHoveredName(displayName);
                                    } else if (districtType === 'precinct') {
                                        const displayName = `Precinct ${feature.properties.NAME20 || 'Unknown'}`;
                                        setHoveredName(displayName);
                                    }
                                    layer.setStyle({
                                        color: originalColor,
                                        weight: mouseOverWeight,
                                        fillOpacity: heatmapOn ? heatmapMouseOver : normalMouseOver,
                                    });
                                },
                                mouseout: () => {
                                    const originalColor = layer.options.color;
                                    setHoveredName('');

                                    layer.setStyle({
                                        color: originalColor,
                                        weight: mouseOutWeight,
                                        fillOpacity: heatmapOn ? heatmapOpacity : normalOpacity,
                                    });

                                },
                                click: () => {
                                    console.log('Feature clicked:', feature.properties);

                                    const properties = feature.properties;

                                    // Calculate summary data
                                    const totalVotes = properties.G20PRERTRU + properties.G20PREDBID;
                                    const voterDistribution = {
                                        republican: `${((properties.G20PRERTRU / totalVotes) * 100).toFixed(1)}%`,
                                        democratic: `${((properties.G20PREDBID / totalVotes) * 100).toFixed(1)}%`,
                                    };

                                    const racialSummary = {
                                        white: (properties.WHT_NHSP22 || 0).toLocaleString(),
                                        black: (properties.BLK_NHSP22 || 0).toLocaleString(),
                                        hispanic: (properties.HSP_POP22 || 0).toLocaleString(),
                                        asian: (properties.ASN_NHSP22 || 0).toLocaleString(),
                                        other: (properties.OTH_NHSP22 || 0).toLocaleString(),
                                    };

                                    const incomeDistribution = [
                                        {
                                            label: 'Less than $25K',
                                            value:
                                                (properties.LESS_10K22 || 0) +
                                                (properties['10K_15K22'] || 0) +
                                                (properties['15K_20K22'] || 0) +
                                                (properties['20K_25K22'] || 0),
                                        },
                                        {
                                            label: '$25K - $50K',
                                            value:
                                                (properties['25K_30K22'] || 0) +
                                                (properties['30K_35K22'] || 0) +
                                                (properties['35K_40K22'] || 0) +
                                                (properties['40K_45K22'] || 0) +
                                                (properties['45K_50K22'] || 0),
                                        },
                                        {
                                            label: '$50K - $75K',
                                            value: (properties['50K_60K22'] || 0) + (properties['60K_75K22'] || 0),
                                        },
                                        {
                                            label: '$75K - $125K',
                                            value: (properties['75K_100K22'] || 0) + (properties['100_125K22'] || 0),
                                        },
                                        {
                                            label: '$125K or More',
                                            value:
                                                (properties['125_150K22'] || 0) +
                                                (properties['150_200K22'] || 0) +
                                                (properties['200K_MOR22'] || 0),
                                        },
                                    ];

                                    // Set the popup data
                                    setDistrictSummary({
                                        districtName: districtType === 'cd'
                                            ? `District ${feature.properties.District || feature.properties.DISTRICT || 'Unknown'}`
                                            : `Precinct ${feature.properties.NAME20 || 'Unknown'}`,
                                        voterDistribution,
                                        racialSummary,
                                        incomeDistribution,
                                        medianIncome: `$${(properties.MEDN_INC22 || 0).toLocaleString()}`,
                                    });

                                    setShowPopup(true); // Show popup
                                },
                            });
                        },
                    }).addTo(map);
                    setLayers(prevLayers => [...prevLayers, newLayer]);
                }
            })
            .catch((error) => {
                console.error(`Error loading the ${districtType} GeoJSON file:`, error);
            });
    };


    useEffect(() => {
        if (!map) {
            if (isZoomed == false) {
                map = L.map('map').setView(initialView.center, initialView.zoom);
            } else if (currentState == 'Mississippi') {
                map = L.map('map').fitBounds(mississippiBounds);
            } else {
                map = L.map('map').fitBounds(connecticutBounds);
            }
            const tileLayer = L.tileLayer(tileLayerUrl, {
                attribution:
                    '&copy; <a href="https://www.maptiler.com/copyright/" target="_blank">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap contributors</a>',
            }).addTo(map);

            axios.get('/api/data/state_borders')
                .then((response) => {
                    const data = response.data;
                    L.geoJSON(data, {
                        style: (feature) => {
                            if (feature.properties.name === 'Mississippi') {
                                return getHighlightStyle('red');
                            }
                            if (feature.properties.name === 'Connecticut') {
                                return getHighlightStyle('blue');
                            }
                            return {
                                color: '#3388ff',
                                weight: 1,
                                fillOpacity: 0,
                            };
                        },
                        onEachFeature: (feature, layer) => {
                            layer.on({
                                mouseover: () => {
                                    if (!isZoomed) {
                                        layer.setStyle({
                                            weight: 2,
                                            color: '#666',
                                            dashArray: '',
                                            fillOpacity: 0.7,
                                            shadowColor: '#9bc7e8',
                                            shadowBlur: 10,
                                        });
                                    }
                                },
                                mouseout: () => {
                                    if (!isZoomed) {
                                        layer.setStyle({
                                            weight: 2,
                                            color: feature.properties.name === 'Mississippi' ? 'red' : 'blue',
                                            fillOpacity: 0.1,
                                            shadowColor: 'none',
                                            shadowBlur: 0,
                                        });
                                    }
                                },
                                click: () => {
                                    handleStateClick(feature);
                                },
                            });
                        },
                        isStateBorder: true,

                    }).addTo(map);
                })
                .catch((error) => {
                    console.error('Error loading the state borders data from server:', error);
                });
            if (isZoomed) {
                loadDistrictData(districtType, currentState);
            }
        }

        // passing functions to parent as props
        setZoomToConnecticut(() => zoomToConnecticut);
        setZoomToMississippi(() => zoomToMississippi);
        setResetView(() => handleResetView);
        setHandleheatmaps(() => handleHeatmap);
        onSetDistrictHighlighted(setDistrictHighlighted);

        return () => {
            if (map) {
                map.remove();
                map = null;
            }
        };
    }, [zoomPercentage, heatmapOn, currentState, currentHeatmap, districtType, currentRace, districtHighlighted]);

    const zoomToMississippi = () => {
        setZoomPercentage("30%")
        map.fitBounds(mississippiBounds);
        setIsZoomed(true);
        if (!(currentState === 'Mississippi')) {
            setCurrentState("Mississippi")
        }
        setShowButtons(true);
    };

    const zoomToConnecticut = () => {
        if (!map) {
            console.error("Map is not initialized");
            return;
        }
        setZoomPercentage("33%")
        map.fitBounds(connecticutBounds);
        setIsZoomed(true);
        if (!(currentState === 'Connecticut')) {
            setCurrentState("Connecticut")
        }
        setShowButtons(true);
    };

    const handleResetView = () => {
        if (map) {
            map.setView(initialView.center, initialView.zoom);
            setIsZoomed(false);
            setZoomPercentage("100%");
            setShowButtons(false);
            handleHeatmap("Heatmap Off", false);
            handleReset();
        }
    };

    const handleStateClick = (feature) => {
        const stateName = feature.properties.name;
        if (stateName === 'Mississippi') {
            zoomToMississippi();
        } else if (stateName === 'Connecticut') {
            zoomToConnecticut();
        }
    };

    const handleHeatmap = (heatmap, auto_status) => {
        if (heatmap === 'Heatmap Off') {
            setCurrentHeatmap('Heatmap Off');
            setHeatmapOn(false);
            setHeatmapAuto(false);
        } else if (heatmap === 'Heatmap Auto') {
            setCurrentHeatmap(heatmap);
            setHeatmapOn(true);
            setHeatmapAuto(true);
        } else if (auto_status == false) {
            setCurrentHeatmap(heatmap);
            setHeatmapOn(true);
            setHeatmapAuto(false);
        } else {
            setCurrentHeatmap(heatmap);
            setHeatmapOn(true);
        }
    };

    return (
        <div style={{ position: 'relative', height: 'calc(100vh - 60px)', width: zoomPercentage, }}>
            <div
                id="map"
                style={mapIconDivStyle}
            >
                <IconButton
                    onClick={handleCombinedClick}
                    style={mapIconStyle}
                >
                    <MapIcon />
                </IconButton>
            </div>

            {showPopup && (
                <div style={popupStyle}>
                    <button style={closeButtonStyle} onClick={() => setShowPopup(false)}>
                        &times;
                    </button>
                    <h3 style={{ marginBottom: '10px' }}>{districtSummary.districtName}</h3>

                    <div style={{ marginBottom: '10px' }}>
                        <strong>Voter Distribution:</strong>
                        <p style={lineStyle}>Republican: {districtSummary.voterDistribution.republican}</p>
                        <p style={lineStyle}>Democratic: {districtSummary.voterDistribution.democratic}</p>
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                        <strong>Racial/Ethnic Distribution:</strong>
                        <p style={lineStyle}>White: {districtSummary.racialSummary.white}</p>
                        <p style={lineStyle}>Black: {districtSummary.racialSummary.black}</p>
                        <p style={lineStyle}>Hispanic: {districtSummary.racialSummary.hispanic}</p>
                        <p style={lineStyle}>Asian: {districtSummary.racialSummary.asian}</p>
                        <p style={lineStyle}>Other: {districtSummary.racialSummary.other}</p>
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                        <strong>Income Distribution:</strong>
                        {districtSummary.incomeDistribution.map((income, index) => (
                            <p key={index} style={lineStyle}>
                                {income.label}: {income.value.toLocaleString()}
                            </p>
                        ))}
                        <p style={lineStyle}>
                            <strong>Median Income:</strong> {districtSummary.medianIncome}
                        </p>
                    </div>
                </div>
            )}





            {isZoomed && hoveredName && (
                <div id="hovered-info" style={hoveredNameStyle}>
                    {hoveredName}
                </div>
            )}

            {showButtons && (
                <div className="button-container">
                    <select
                        className="select"
                        value={districtType}
                        onChange={(e) => setDistrictType(e.target.value)}
                    >
                        <option value="cd">District</option>
                        <option value="precinct">Precinct</option>
                    </select>
                </div>
            )}
            {isZoomed && (
                <IconButton
                    onClick={handleResetView}
                    style={undoIconStyle}
                >
                    <UndoIcon />Reset
                </IconButton>

            )}
        </div>

    );
}

const getHighlightStyle = (color) => {
    return {
        color: color,
        weight: 2,
        fillOpacity: 0.1,
    };
};

const initialView = {
    center: [37.1, -95.7],
    zoom: 5,
};

const mississippiBounds = [
    [29.7, -91.7],
    [35.2, -88.2]
];

const connecticutBounds = [
    [40.9509, -73.7272],
    [42.050, -71.799]
];

const RaceColors = {
    White: {
        White10: '#ffffcc',
        White20: '#ffeda0',
        White30: '#fed976',
        White40: '#feb24c',
        White50: '#fd8d3c',
        White60: '#fc4e2a',
        White70: '#e31a1c',
        White80: '#bd0026',
        White90: '#800026',
        White100: '#2e000e'
    },
    Black: {
        Black10: '#ffffd9',
        Black20: '#edf8b1',
        Black30: '#c7e9b4',
        Black40: '#7fcdbb',
        Black50: '#41b6c4',
        Black60: '#1d91c0',
        Black70: '#225ea8',
        Black80: '#253494',
        Black90: '#081d58',
        Black100: '#081d58'
    },
    Hispanic: {
        Hispanic10: '#ffffe5',
        Hispanic20: '#f7fcb9',
        Hispanic30: '#d9f0a3',
        Hispanic40: '#addd8e',
        Hispanic50: '#78c679',
        Hispanic60: '#41ab5d',
        Hispanic70: '#238443',
        Hispanic80: '#006837',
        Hispanic90: '#004529',
        Hispanic100: '#004529'
    },
    Asian: {
        Asian10: '#fff7f3',
        Asian20: '#fde0dd',
        Asian30: '#fcc5c0',
        Asian40: '#fa9fb5',
        Asian50: '#f768a1',
        Asian60: '#dd3497',
        Asian70: '#ae017e',
        Asian80: '#7a0177',
        Asian90: '#49006a',
        Asian100: '#49006a'
    }
};

function getIncomeColor(income) {
    let fillColor;
    if (income < 30000) {
        fillColor = '#e5f5e0'; // Light green
    } else if (income >= 30000 && income < 45000) {
        fillColor = '#c7e9c0';
    } else if (income >= 45000 && income < 60000) {
        fillColor = '#a1d99b';
    } else if (income >= 60000 && income < 75000) {
        fillColor = '#74c476';
    } else if (income >= 75000 && income < 90000) {
        fillColor = '#41ab5d';
    } else if (income >= 90000 && income < 105000) {
        fillColor = '#238b45';
    } else if (income >= 105000 && income < 120000) {
        fillColor = '#006d2c';
    } else if (income >= 120000 && income < 135000) {
        fillColor = '#00441b';
    } else if (income >= 135000 && income < 150000) {
        fillColor = '#002611';
    } else if (income >= 150000) {
        fillColor = '#001208';
    } else {
        fillColor = 'grey';
    }
    return fillColor;
}

function getRegionColor(region) {
    let fillColor;
    if (region === 'Rural') {
        fillColor = '#e7e1ef';
    } else if (region === 'Suburban') {
        fillColor = '#c994c7';
    } else if (region === 'Urban') {
        fillColor = '#dd1c77';
    } else {
        fillColor = 'grey';
    }
    return fillColor;
}

function getPovertyColor(poverty) {
    let fillColor;
    if (poverty < 5) {
        fillColor = '#fff7f3';
    } else if (poverty >= 5 && poverty < 10) {
        fillColor = '#d7b5d8';
    } else if (poverty >= 10 && poverty < 15) {
        fillColor = '#df65b0';
    } else if (poverty >= 15 && poverty < 20) {
        fillColor = '#dd1c77';
    } else if (poverty >= 20) {
        fillColor = '#980043';
    } else {
        fillColor = 'grey';
    }
    return fillColor;
}

function getPolIncColor(republicanPercentage, democraticPercentage, income) {
    let fillColor;
    let percentColor;
    if (republicanPercentage > democraticPercentage) {
        const leadPercentage = republicanPercentage;
        if (leadPercentage >= 90) percentColor = 'hsl(0, 100%, 14.71%)';
        else if (leadPercentage >= 75) percentColor = 'hsl(0, 100%, 27.25%)';
        else if (leadPercentage >= 60) percentColor = 'hsl(0, 67.92%, 41.57%)';
        else if (leadPercentage >= 45) percentColor = 'hsl(0, 53.05%, 58.24%)';
        else percentColor = 'hsl(0, 78.87%, 72.16%)';
    } else {
        const leadPercentage = democraticPercentage;
        if (leadPercentage >= 90) percentColor = 'hsl(240, 100%, 27.25%)';
        else if (leadPercentage >= 75) percentColor = 'hsl(240, 100%, 40.2%)';
        else if (leadPercentage >= 60) percentColor = 'hsl(225, 72.73%, 56.86%)';
        else if (leadPercentage >= 45) percentColor = 'hsl(197.4, 71.43%, 72.55%)';
        else percentColor = 'hsl(194.74, 53.27%, 79.02%)';
    }
    fillColor = changeHue(percentColor, income);
    return fillColor;
}

function changeHue(color, income) {
    let fillColor;
    if (income < 25000) {
        fillColor = adjustHue(color, -20);
    } else if (income >= 25000 && income < 50000) {
        fillColor = adjustHue(color, -10);;
    } else if (income >= 50000 && income < 75000) {
        fillColor = adjustHue(color, 0);;
    } else if (income >= 75000 && income < 100000) {
        fillColor = adjustHue(color, 10);;
    } else if (income >= 100000) {
        fillColor = adjustHue(color, 20);;
    }
    return fillColor;
}

function adjustHue(hslColor, increment) {
    // Updated regex to allow decimals for the hue
    const regex = /hsl\(([\d.]+),\s*([\d.]+%)\s*,\s*([\d.]+%)\)/;
    const match = hslColor.match(regex);

    if (match) {
        let hue = parseFloat(match[1]); // Parse the hue as a float to support decimals
        const saturation = match[2]; // Keep the saturation
        const lightness = match[3]; // Keep the lightness

        // Adjust the hue
        hue = (hue + increment) % 360; // Ensure it wraps around 360
        if (hue < 0) hue += 360; // Handle negative values

        // Return the updated HSL color
        return `hsl(${hue}, ${saturation}, ${lightness})`;
    } else {
        throw new Error("Invalid HSL color format");
    }
}

function getTrumpColor(percentage) {
    let fillColor;
    if (percentage < 10) {
        fillColor = '#e8ddd8';
    } else if (percentage >= 10 && percentage < 20) {
        fillColor = '#fee0d2';
    } else if (percentage >= 20 && percentage < 30) {
        fillColor = '#fcbba1';
    } else if (percentage >= 30 && percentage < 40) {
        fillColor = '#fc9272';
    } else if (percentage >= 40 && percentage < 50) {
        fillColor = '#fb6a4a';
    } else if (percentage >= 50 && percentage < 60) {
        fillColor = '#ef3b2c';
    } else if (percentage >= 60 && percentage < 70) {
        fillColor = '#cb181d';
    } else if (percentage >= 70 && percentage < 80) {
        fillColor = '#a50f15';
    } else if (percentage >= 80 && percentage < 90) {
        fillColor = '#67000d';
    } else if (percentage >= 90) {
        fillColor = '#420109';
    } else {
        fillColor = 'grey';
    }
    return fillColor;
}

function getBidenColor(percentage) {
    let fillColor;
    if (percentage < 10) {
        fillColor = '#e1e8ed';
    } else if (percentage >= 10 && percentage < 20) {
        fillColor = '#deebf7';
    } else if (percentage >= 20 && percentage < 30) {
        fillColor = '#c6dbef';
    } else if (percentage >= 30 && percentage < 40) {
        fillColor = '#9ecae1';
    } else if (percentage >= 40 && percentage < 50) {
        fillColor = '#6baed6';
    } else if (percentage >= 50 && percentage < 60) {
        fillColor = '#4292c6';
    } else if (percentage >= 60 && percentage < 70) {
        fillColor = '#2171b5';
    } else if (percentage >= 70 && percentage < 80) {
        fillColor = '#08519c';
    } else if (percentage >= 80 && percentage < 90) {
        fillColor = '#08306b';
    } else if (percentage >= 90) {
        fillColor = '#041b3d';
    } else {
        fillColor = 'grey';
    }
    return fillColor;
}

// All styles go here:

const mapIconStyle = {
    position: 'absolute',
    bottom: '80px',
    left: '20px',
    backgroundColor: 'white',
    borderRadius: '50%',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    zIndex: 1000,
};

const undoIconStyle = {
    position: 'absolute',
    bottom: '20px',
    left: '20px',
    backgroundColor: 'white',
    borderRadius: '50%',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    zIndex: 1000,
};

const hoveredNameStyle = {
    position: 'absolute',
    top: '25px',
    left: '60px',
    padding: '10px',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: '8px',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    zIndex: 1000,
};

const mapIconDivStyle = {
    height: '100%',
    width: '100%',
    marginBottom: '0',
    padding: '0',
};

const lineStyle = {
    margin: '2px 0',
    paddingLeft: '10px',
    fontSize: '14px',
    lineHeight: '1.5',
};

const popupStyle = {
    position: 'absolute',
    top: '50px',
    left: '50px',
    padding: '15px',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '8px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
    maxWidth: '350px',
    zIndex: 1000,
    fontFamily: 'Arial, sans-serif',
};

const closeButtonStyle = {
    position: 'absolute',
    top: '5px',
    right: '5px',
    background: 'none',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
};
