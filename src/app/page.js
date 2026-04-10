"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import 'leaflet/dist/leaflet.css';
import Header from '@/components/header';
import DisplayData from '@/components/displayData';
import NavBar from '@/components/NavBar';

const Map = dynamic(() => import('../components/Map'), { ssr: false });

export default function Home() {
  const [zoomToMississippi, setZoomToMississippi] = useState(null);
  const [zoomToConnecticut, setZoomToConnecticut] = useState(null);
  const [resetView, setResetView] = useState(null);
  const [currentState, setCurrentState] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [showMap, setShowMap] = useState(true);
  const [selectedTab, setSelectedTab] = useState('Overview'); // Default tab
  const [selectedCategory, setSelectedCategory] = useState('Votes'); // Default for State Overview
  const [selectedSubCategory, setSelectedSubCategory] = useState('Votes');
  const [handleHeatmaps, setHandleheatmaps] = useState(null);
  const [heatmapOn, setHeatmapOn] = useState(false);
  const [currentHeatmap, setCurrentHeatmap] = useState('Heatmap Off');
  const [currentRace, setCurrentRace] = useState('White');
  const [heatmapAuto, setHeatmapAuto] = useState(false);
  const [resetNavBar, setResetNavBar] = useState(false);
  const [childSetDistrictHighlighted, setChildSetDistrictHighlighted] = useState(null);

  // Callback function to receive the setter from the child
  const handleSetDistrictHighlighted = (setter) => {
    setChildSetDistrictHighlighted(() => setter);
  };

  const handleZoomToMississippi = () => {
    setShowMap(true);
    zoomToMississippi();
  };

  const handleZoomToConnecticut = () => {
    setShowMap(true);
    zoomToConnecticut();
  };

  const handleReset = () => {
    if (resetView) {
      resetView();
    }
    setResetNavBar(true); // Trigger navbar reset
    setTimeout(() => setResetNavBar(false), 0); // Reset the state after propagation
  };

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </Head>

      <div id="LandingPageDiv" style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        {showMap && (
          <Header
            handleZoomToMississippi={handleZoomToMississippi}
            handleZoomToConnecticut={handleZoomToConnecticut}
            resetView={resetView}
            setShowMap={setShowMap}
            showMap={showMap}
          />
        )}

        <div
          id="MapDiv"
          style={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            height: '100%',
            marginLeft: 'auto',
            marginBottom: '5px',
            overflow: 'hidden',
          }}
        >
          {showMap && (
            <div
              id="Search"
              style={{
                display: 'flex',
                flexDirection: 'row',
                width: '15%',
                marginLeft: 'auto',
              }}
            >
              <NavBar
                handleZoomToMississippi={handleZoomToMississippi}
                handleZoomToConnecticut={handleZoomToConnecticut}
                setSelectedTab={setSelectedTab}
                setSelectedCategory={setSelectedCategory}
                setSubCategory={setSelectedSubCategory}
                handleResetView={resetView}
                currentState={currentState}
                handleHeatmaps={handleHeatmaps}
                currentHeatmap={currentHeatmap}
                currentRace={currentRace}
                heatmapOn={heatmapOn}
                heatmapAuto={heatmapAuto}
                setCurrentRace={setCurrentRace}
                resetNavBar={resetNavBar}
              />
            </div>
          )}

          {showMap && <Map
            setZoomToMississippi={setZoomToMississippi}
            setZoomToConnecticut={setZoomToConnecticut}
            setResetView={setResetView}
            currentState={currentState}
            setCurrentState={setCurrentState}
            isZoomed={isZoomed}
            setIsZoomed={setIsZoomed}
            setHandleheatmaps={setHandleheatmaps}
            setHeatmapOn={setHeatmapOn}
            heatmapOn={heatmapOn}
            setCurrentHeatmap={setCurrentHeatmap}
            currentHeatmap={currentHeatmap}
            setCurrentRace={setCurrentRace}
            currentRace={currentRace}
            setHeatmapAuto={setHeatmapAuto}
            heatmapAuto={heatmapAuto}
            handleReset={handleReset}
            onSetDistrictHighlighted={handleSetDistrictHighlighted}
          />}
          {showMap && isZoomed && (
            <DisplayData
              currentState={currentState}
              selectedTab={selectedTab}
              selectedCategory={selectedCategory}
              setSelectedTab={setSelectedTab}
              setSelectedCategory={setSelectedCategory}
              setSubCategory={setSelectedSubCategory}
              selectedSubCategory={selectedSubCategory}
              childSetDistrictHighlighted={childSetDistrictHighlighted}
            />
          )}
        </div>
      </div>
    </>
  );
}