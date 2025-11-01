# Notion Word Counter

## Overview
A simple Express web application that connects to Notion and counts words from a specified Notion page. The app displays the word count in a clean, minimal interface.

## Project Architecture
- **Language**: Node.js (ES Modules)
- **Framework**: Express 5.x
- **External Service**: Notion API via @notionhq/client
- **Port**: 5000 (frontend web server)

## Setup Requirements
This application requires two environment secrets:
1. `NOTION_TOKEN` - Your Notion integration token
2. `NOTION_PAGE_ID` - The ID of the Notion page to count words from

### Getting Your Notion Credentials
1. **Create a Notion Integration**:
   - Go to https://www.notion.so/my-integrations
   - Create a new integration
   - Copy the "Internal Integration Token" - this is your `NOTION_TOKEN`

2. **Get Your Page ID**:
   - Open the Notion page you want to track
   - Copy the page URL - the ID is the part between the workspace and the `?`
   - Example: `notion.so/workspace/PAGE_ID?v=...`

3. **Connect Integration to Page**:
   - Open your Notion page
   - Click the three dots menu → "Add connections"
   - Select your integration

## Recent Changes
- **2025-11-01**: Initial setup for Replit environment
  - Configured Express to bind to 0.0.0.0:5000
  - Added error handling for missing credentials
  - Added "type": "module" to package.json for ES module support
  - Set up npm start script
  - Created .gitignore for Node.js projects

## Project Structure
```
.
├── index.js          # Main Express application
├── package.json      # Node.js dependencies and scripts
└── replit.md         # This file
```

## How It Works
1. The app fetches all blocks from the specified Notion page
2. Extracts text content from paragraph blocks
3. Counts words (splits by whitespace)
4. Displays the count in a simple HTML page
