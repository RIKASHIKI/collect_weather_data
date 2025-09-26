# Weather Data Collector

## Overview
A Node.js CLI application that collects weather forecast data from the Indonesian BMKG (Meteorology, Climatology, and Geophysics Agency) API and exports it to Excel files. The application fetches weather data for specific locations and time periods (7 AM to 6 PM) and allows manual data override capabilities.

## Project Structure
- `getcuaca.js` - Main data collection script (primary entry point)
- `index.js` - Alternative collection script with different filtering logic
- `test.js` - Test version of the data collection script
- `helper/`
  - `config.js` - Configuration file with API endpoints and location IDs
  - `function.js` - Utility functions for date formatting
  - `dummy.json` - Sample data structure
- `data.xlsx` - Main output Excel file
- `test.xlsx` - Test output Excel file

## Key Features
- Fetches weather data from BMKG API for specific location IDs
- Filters data for operating hours (7 AM - 6 PM)
- Exports data to Excel with API data and manual data columns
- Prevents overwriting manual data entries
- Handles missing data with appropriate placeholders
- Indonesian date formatting support

## Configuration
The application is configured in `helper/config.js`:
- `ID_API`: '63.01.09.2012' (Jilatan Alur location)
- `ID_API2`: '63.72.04.1001' (Loktabat Utara location)
- `API`: BMKG public weather forecast endpoint

## Usage
- Main script: `npm start` (runs getcuaca.js)
- Test script: `npm test` (runs test.js)
- Alternative: `node index.js`

## Dependencies
- **express**: Web framework (v5.1.0)
- **node-schedule**: Job scheduling library (v2.1.1)
- **xlsx**: Excel file processing library (v0.18.5)

## Data Collection Process
1. Fetches weather data from BMKG API
2. Filters data for research hours (7 AM - 6 PM)
3. Formats timestamps in Indonesian locale
4. Updates Excel file while preserving manual entries
5. Logs all operations and changes

## Recent Changes
- September 26, 2025: Project imported and set up for Replit environment
- Workflow configured for console-based data collection
- All dependencies verified and working

## Technical Notes
- This is a CLI application without a web frontend
- Designed for periodic data collection and research purposes
- Uses Indonesian locale for date formatting
- Supports manual data override to prevent automatic overwrites