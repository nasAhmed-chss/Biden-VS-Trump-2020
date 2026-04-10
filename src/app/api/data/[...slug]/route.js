import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Map endpoint names to filenames in public/data/
const FILE_MAP = {
  state_borders:                  { file: 'state_borders.json',                type: 'json' },
  connecticut_income_data:        { file: 'connecticut_income_data.json',       type: 'json' },
  CT_voting_data:                 { file: 'connecticut_voting_data.json',       type: 'json' },
  connecticut_race_data:          { file: 'connecticut_race_data.json',         type: 'json' },
  CT_RaceVotesBreakdown:          { file: 'CT_RaceVotesBreakdown.json',         type: 'json' },
  MS_RaceVotesBreakdown:          { file: 'MS_RaceVotesBreakdown.json',         type: 'json' },
  CT_RaceVSIncome:                { file: 'CT_RaceVSIncome.json',               type: 'json' },
  MS_RaceVSIncome:                { file: 'MS_RaceVSIncome.json',               type: 'json' },
  IncomeEcologicalInferenceData:  { file: 'IncomeEcologicalInferenceData.json', type: 'json' },
  mississippi_income_data:        { file: 'mississippi_income_data.json',       type: 'json' },
  mississippi_race_data:          { file: 'mississippi_race_data.json',         type: 'json' },
  MS_voting_data:                 { file: 'mississippi_voting_data.json',       type: 'json' },
  MS_Ensemble_Data:               { file: 'MS_Ensemble_Data.json',              type: 'json' },
  'state-overview-data':          { file: 'stateOverview_data.json',            type: 'json' },
  CongressionalRepresentation:    { file: 'CongressionalRepresentation.json',   type: 'json' },
  CT_Representation:              { file: 'CT_Representation.json',             type: 'json' },
  MS_Representation:              { file: 'MS_Representation.json',             type: 'json' },
  RaceEcoInferenceData:           { file: 'RaceEcoInferenceData.json',          type: 'json' },
  RegionEI:                       { file: 'RegionEI.json',                      type: 'json' },
  CT_precinct_data:               { file: 'CT_precinct_data.csv',               type: 'csv'  },
  MS_precinct_data:               { file: 'MS_precinct_data.csv',               type: 'csv'  },
};

function readDataFile(filename) {
  const filePath = path.join(process.cwd(), 'public', 'data', filename);
  return fs.readFileSync(filePath, 'utf8');
}

export async function GET(request, { params }) {
  const slug = params.slug;

  try {
    // GET /api/data/states
    if (slug.length === 1 && slug[0] === 'states') {
      return NextResponse.json(['Mississippi', 'Connecticut']);
    }

    // GET /api/data/[state]/Master_Data
    // Returns the geojson data for the given state directly
    if (slug.length === 2 && slug[1] === 'Master_Data') {
      const state = slug[0]; // e.g. "Connecticut" or "Mississippi"
      const filename = `${state}_Master_Data.geojson`;
      const data = readDataFile(filename);
      return new NextResponse(data, {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // GET /api/data/boundary-data?state=X&districtType=Y
    if (slug.length === 1 && slug[0] === 'boundary-data') {
      const { searchParams } = new URL(request.url);
      const state = searchParams.get('state') ?? '';
      const districtType = searchParams.get('districtType') ?? '';

      const BOUNDARY_MAP = {
        connecticut: {
          cd:       'CT_CD_boundaries.json',
          county:   'connecticut_county_borders.json',
          precinct: 'CT_precinctAndVotingData.geojson',
          income:   'CT_incomeByBlock.geojson',
        },
        mississippi: {
          cd:       'MS_CD_boundaries.json',
          county:   'mississippi_county_borders.json',
          precinct: 'MS_precinctAndVotingData.geojson',
          income:   'MS_incomeByBlock.geojson',
        },
      };

      const stateKey = state.toLowerCase();
      const filename = BOUNDARY_MAP[stateKey]?.[districtType];

      if (!filename) {
        return NextResponse.json(
          { error: 'Invalid state or districtType parameter.' },
          { status: 400 }
        );
      }

      const data = readDataFile(filename);
      return new NextResponse(data, {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // GET /api/data/[endpoint]  — simple file passthrough
    if (slug.length === 1) {
      const endpoint = slug[0];
      const mapping = FILE_MAP[endpoint];

      if (!mapping) {
        return NextResponse.json({ error: `Unknown endpoint: ${endpoint}` }, { status: 404 });
      }

      const data = readDataFile(mapping.file);
      const contentType = mapping.type === 'csv' ? 'text/csv' : 'application/json';
      return new NextResponse(data, {
        headers: { 'Content-Type': contentType },
      });
    }

    return NextResponse.json({ error: 'Invalid endpoint.' }, { status: 404 });
  } catch (err) {
    console.error('[API] Error serving data:', err.message);
    return NextResponse.json(
      { error: 'Failed to read data file.', detail: err.message },
      { status: 500 }
    );
  }
}
