import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './landingPage.css';
import Header from '@/components/header';
import GinglesGraph from './GinglesGraph';
import IncomeEcologicalInference from './IncomeEcologicalInference';

const LandingPage = ({ handleZoomToMississippi, handleZoomToConnecticut, resetView, setShowMap, showMap }) => {
    const floatDown = {
        hidden: { y: -100, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 50, damping: 20, duration: 2 },
        },
    };
    const [populationType, setPopulationType] = useState('White'); 
    const demographics = ['African American', 'White', 'Hispanic/Latino']; 

    const handleToggle = () => {
        const currentIndex = demographics.indexOf(populationType);
        const nextIndex = (currentIndex + 1) % demographics.length; 
        setPopulationType(demographics[nextIndex]);
    };


    return (
        <div className="landingPageContainer scrollbar-hide">
            <header className="titleSection">
                <h1 className="title">Unpacking the Vote</h1>
                <nav className="taskbar">
                    <ul>
                        <li>Home</li>
                        <li onClick={() => {

                            setShowMap(true)
                        }}>Map</li>

                    </ul>
                </nav>

            </header>
            <div>
                {/* First Section: States */}
                <div className='titleContainer'>
                    <h2 className="stateText">Connecticut</h2>
                    <h2 className="stateText">Mississippi</h2>
                </div>
                <section className="stateSection">
                    {/* Connecticut */}
                    <motion.div
                        className="stateContainer connecticutImage"
                        initial="hidden"
                        animate="visible"
                        variants={floatDown}
                        onClick={() => {
                            setShowMap(true);
                        }}
                    >
                        <img src="/images/connecticut.svg" alt="Connecticut" className="stateImage" />
                    </motion.div>

                    {/* Mississippi */}
                    <motion.div
                        className="stateContainer mississippiImage"
                        initial="hidden"
                        animate="visible"
                        variants={floatDown}
                        onClick={() => {
                            setShowMap(true);
                        }}
                    >
                        <img
                            src="/images/mississippi.svg"
                            alt="Mississippi"
                            className="stateImage"
                        />
                    </motion.div>
                </section>

            </div>

            {/* Second Section: Gingles */}
            <section className="analysisSection">
                <div className="analysisContainer">
                    <h2 className="analysisTitle">Gingles</h2>
                    <div className="graph">
                        {/* Pass the dynamic populationType */}
                        <GinglesGraph populationType={populationType} currentState={"Connecticut"} />
                    </div>
                </div>
                <div className="infoContainer">
                    <p className="infoText">
                        Gingles analysis provides insights into voting patterns and demographic correlations in the state.
                    </p>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        {/* Learn More Button */}
                        <button
                            className="infoButton"
                            onClick={() => {
                                setShowMap(true);
                                resetView();
                            }}
                        >
                            Learn More
                        </button>

                        {/* Toggle Demographics Button */}
                        <button
                            style={{
                                backgroundColor: '#001f1f', // Background color
                                color: 'white', // Text color
                                padding: '10px 20px',
                                border: 'none',
                                borderRadius: '5px',
                                fontSize: '14px',
                                cursor: 'pointer'
                            }}
                            onClick={handleToggle}
                        >
                            View {demographics[(demographics.indexOf(populationType) + 1) % demographics.length]}
                        </button>
                    </div>
                </div>
            </section>

            {/* Third Section: Eco Inferences */}
            <section className="analysisSection">
                <div className="analysisContainer">
                    <h2 className="analysisTitle">Ecological Inferences</h2>
                    <div className="graph">
                        <IncomeEcologicalInference state={"Connecticut"} party={"Democrat"} />
                    </div>
                </div>
                <div className="infoContainer">
                    <p className="infoText">
                        Ecological Inferences explore the relationship between economic indicators and voting outcomes.
                    </p>
                    <button className="infoButton" onClick={() => {
                        setShowMap(true)
                        resetView();

                    }}>Learn More</button>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
