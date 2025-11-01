# Notion Word Count Widget

A simple Express server that displays word counts from Notion pages. Perfect for embedding in Notion as a live widget.

## Features

- Real-time word count from any Notion page
- Support for multiple pages via query parameters
- Customizable font size, color, and style
- Built-in refresh button
- Easy to deploy and embed

## Setup

### 1. Create a Notion Integration

1. Go to [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Click "New integration"
3. Give it a name (e.g., "Word Count Widget")
4. Copy the "Internal Integration Token"

### 2. Share Your Notion Page

1. Open the Notion page you want to track
2. Click "Share" in the top right
3. Click "Invite" and select your integration

### 3. Get Your Page ID

The page ID is in your Notion page URL:
```
https://www.notion.so/Your-Page-Title-{PAGE_ID}
```

## Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file:
   ```bash
   cp .env.example .env
   ```

4. Add your credentials to `.env`:
   ```
   NOTION_TOKEN=secret_xxxxxxxxxxxxx
   NOTION_PAGE_ID=xxxxxxxxxxxxx
   ```

5. Start the server:
   ```bash
   npm start
   ```

6. Visit [http://localhost:3000](http://localhost:3000)

## Deploy to Render

### Quick Deploy

1. Push your code to GitHub
2. Go to [render.com](https://render.com) and sign in with GitHub
3. Click "New +" → "Web Service"
4. Connect your `word-count-widget` repository
5. Render will auto-detect the settings from `render.yaml`
6. Add your environment variables:
   - `NOTION_TOKEN`: Your Notion integration token
   - `NOTION_PAGE_ID`: (Optional) Default page ID
7. Click "Create Web Service"

Your widget will be deployed in a few minutes at `https://your-app-name.onrender.com`

## Usage in Notion

### Single Page (using environment variable)

Simply embed your deployment URL:
```
/embed https://your-app-name.onrender.com
```

### Multiple Pages (using query parameters)

Embed with the page ID in the URL:
```
/embed https://your-app-name.onrender.com?pageId=YOUR_PAGE_ID
```

Each Notion page can have its own embed with a different `pageId` parameter.

## Customization

You can customize the appearance using URL query parameters:

### Available Parameters

- **`pageId`** - Notion page ID to fetch word count from
- **`fontSize`** - Font size (default: `48px`)
  - Examples: `24px`, `3rem`, `2em`
- **`color`** - Text color (default: `#000000`)
  - Examples: `#ff0000`, `rgb(255,0,0)`, `red`
- **`fontFamily`** - Font family (default: `sans-serif`)
  - Examples: `serif`, `monospace`, `Georgia`, `'Comic Sans MS'`

### Example URLs

**Large red text:**
```
https://your-app.onrender.com?pageId=abc123&fontSize=72px&color=red
```

**Small monospace font:**
```
https://your-app.onrender.com?pageId=abc123&fontSize=24px&fontFamily=monospace
```

**Custom color and serif font:**
```
https://your-app.onrender.com?pageId=abc123&color=%23336699&fontFamily=Georgia
```

Note: When using colors with `#`, encode it as `%23` in URLs (e.g., `#336699` becomes `%23336699`)

## How It Works

The widget:
1. Connects to the Notion API using your integration token
2. Fetches all text blocks from the specified page
3. Counts the words
4. Displays the count in a simple HTML page

## License

ISC
