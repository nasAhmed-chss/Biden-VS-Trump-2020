import React, { useState } from 'react';

function Header({ setShowMap, resetView, handleZoomToMississippi, handleZoomToConnecticut }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

    return (
        <header
            className="titleSection"
            style={titleSection}
        >

            <div style={imageStyle}>
                <img
                    src="/images/aggies_logo.jpg"
                    alt="Logo"
                    style={{height: '50px',  width: 'auto',}}
                />
            </div>

            
            <h1
                style={headerStyle}
                className="title"
            >
                Unpacking The Vote
            </h1>
        </header>
    );
}

export default Header;

const titleSection = {
    height: '60px', 
    width: '100%',
    display: 'flex',
    alignItems: 'center', 
    backgroundColor: '#023636', 
    color: 'white', 
    padding: '0 20px', 
    position: 'relative', 
}

const imageStyle = { 
    position: 'absolute', 
    left: '20px' 
}

const headerStyle = {
    fontSize: '1.5vw', 
    whiteSpace: 'nowrap', 
    textAlign: 'center',
    margin: '0', 
    position: 'absolute', 
    left: '50%', 
    transform: 'translateX(-50%)', 
}