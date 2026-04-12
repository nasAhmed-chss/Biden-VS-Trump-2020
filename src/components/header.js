import React from 'react';

const STATE_STATS = {
  Mississippi: { precincts: '1,911', population: '2.9M' },
  Connecticut: { precincts: '741',   population: '3.6M' },
};

function Header({ setShowMap, resetView, handleZoomToMississippi, handleZoomToConnecticut, currentState, isZoomed }) {
  const stats = currentState ? STATE_STATS[currentState] : null;

  return (
    <header style={titleSection}>


      {/* ── Logo ───────────────────────────────────────────────── */}
      <div style={logoWrap}>
        <img src="/images/aggies_logo.jpg" alt="Logo"
          style={{ height: '44px', width: 'auto', borderRadius: '5px',
                   filter: 'drop-shadow(0 0 8px rgba(128,203,196,0.4))' }} />
      </div>

      {/* ── Centre: title + subtitle ────────────────────────────── */}
      <div style={centerWrap}>
        <h1 style={titleStyle}>Unpacking The Vote</h1>
        <p style={subtitleStyle}>Precinct Analysis &amp; Demographic Insights</p>
      </div>

      {/* ── Right: state badge + stats ──────────────────────────── */}
      <div style={rightWrap}>
        {stats ? (
          <>
            <div style={stateBadge}>{currentState}</div>
            <div style={statItem}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                   stroke="rgba(128,203,196,0.8)" strokeWidth="2" style={{marginRight:4}}>
                <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
              <span style={statNum}>{stats.precincts}</span>
              <span style={statLabel}>precincts</span>
            </div>
            <div style={statItem}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                   stroke="rgba(128,203,196,0.8)" strokeWidth="2" style={{marginRight:4}}>
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <span style={statNum}>{stats.population}</span>
              <span style={statLabel}>population</span>
            </div>
          </>
        ) : (
          <span style={selectPrompt}>Select a state to begin</span>
        )}
      </div>

    </header>
  );
}

export default Header;

/* ── Styles ─────────────────────────────────────────────────────── */

const titleSection = {
  height: '82px',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  background: 'linear-gradient(90deg, #010e0e 0%, #011c1c 30%, #022e2e 55%, #011c1c 75%, #010e0e 100%)',
  color: 'white',
  padding: '0 24px',
  position: 'relative',
  boxShadow: '0 1px 0 rgba(128,203,196,0.25), 0 4px 28px rgba(0,0,0,0.65)',
  borderBottom: '1px solid rgba(128,203,196,0.2)',
  boxSizing: 'border-box',
  overflow: 'hidden',
  zIndex: 100,
};


const logoWrap = {
  position: 'relative',
  zIndex: 2,
  display: 'flex',
  alignItems: 'center',
  flexShrink: 0,
};

const centerWrap = {
  position: 'absolute',
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '2px',
  zIndex: 2,
  pointerEvents: 'none',
};

const titleStyle = {
  margin: 0,
  fontSize: 'clamp(16px, 1.6vw, 26px)',
  fontWeight: '700',
  letterSpacing: '0.22em',
  textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.92)',
  lineHeight: 1.15,
};

const subtitleStyle = {
  margin: 0,
  fontSize: 'clamp(8px, 0.68vw, 11.5px)',
  letterSpacing: '0.28em',
  textTransform: 'uppercase',
  color: 'rgba(128,203,196,0.55)',
  fontWeight: '500',
  fontFamily: 'Inter, Arial, sans-serif',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
};

const rightWrap = {
  position: 'absolute',
  right: '20px',
  display: 'flex',
  alignItems: 'center',
  gap: '14px',
  zIndex: 2,
};

const stateBadge = {
  background: 'rgba(128,203,196,0.1)',
  border: '1px solid rgba(128,203,196,0.35)',
  borderRadius: '6px',
  padding: '4px 12px',
  fontSize: '11px',
  fontWeight: '700',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: 'rgba(128,203,196,0.95)',
  fontFamily: 'Inter, Arial, sans-serif',
};

const statItem = {
  display: 'flex',
  alignItems: 'center',
  gap: '2px',
};

const statNum = {
  fontSize: '13px',
  fontWeight: '700',
  color: 'rgba(255,255,255,0.9)',
  fontFamily: 'Inter, Arial, sans-serif',
  marginRight: '3px',
};

const statLabel = {
  fontSize: '10px',
  color: 'rgba(255,255,255,0.4)',
  fontFamily: 'Inter, Arial, sans-serif',
  letterSpacing: '0.04em',
};

const selectPrompt = {
  fontSize: '11px',
  color: 'rgba(255,255,255,0.3)',
  fontFamily: 'Inter, Arial, sans-serif',
  letterSpacing: '0.06em',
  fontStyle: 'italic',
};
