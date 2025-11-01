import { Client } from "@notionhq/client";
import "dotenv/config";
import express from "express";

const app = express();
const notion = new Client({ auth: process.env.NOTION_TOKEN });

app.get("/config", (req, res) => {
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Word Count Widget - Configuration</title>
            <style>
                * {
                    box-sizing: border-box;
                }
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                    margin: 0;
                    padding: 20px;
                    background-color: #f5f5f5;
                }
                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                }
                h1 {
                    text-align: center;
                    color: #333;
                    margin-bottom: 30px;
                }
                .config-wrapper {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                    margin-bottom: 20px;
                }
                .config-panel, .preview-panel {
                    background: white;
                    padding: 25px;
                    border-radius: 8px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }
                .config-panel h2, .preview-panel h2 {
                    margin-top: 0;
                    color: #333;
                    font-size: 18px;
                }
                .form-group {
                    margin-bottom: 20px;
                }
                label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: 500;
                    color: #555;
                }
                input[type="text"],
                input[type="number"],
                select {
                    width: 100%;
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    font-size: 14px;
                }
                input[type="color"] {
                    width: 100%;
                    height: 50px;
                    padding: 0;
                    border: 2px solid #ddd;
                    border-radius: 6px;
                    cursor: pointer;
                    background: none;
                }
                input[type="color"]::-webkit-color-swatch-wrapper {
                    padding: 0;
                }
                input[type="color"]::-webkit-color-swatch {
                    border: none;
                    border-radius: 4px;
                }
                input[type="color"]::-moz-color-swatch {
                    border: none;
                    border-radius: 4px;
                }
                input[type="range"] {
                    width: 100%;
                }
                .range-value {
                    display: inline-block;
                    margin-left: 10px;
                    font-weight: 600;
                    color: #0066cc;
                }
                .preview-iframe {
                    width: 100%;
                    height: 300px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    background: white;
                }
                .url-section {
                    background: white;
                    padding: 25px;
                    border-radius: 8px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }
                .url-display {
                    background: #f8f9fa;
                    padding: 15px;
                    border-radius: 4px;
                    word-break: break-all;
                    font-family: monospace;
                    font-size: 13px;
                    margin-bottom: 15px;
                    border: 1px solid #e9ecef;
                }
                .btn {
                    background-color: #0066cc;
                    color: white;
                    padding: 12px 24px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 16px;
                    font-weight: 500;
                    width: 100%;
                }
                .btn:hover {
                    background-color: #0052a3;
                }
                .btn:active {
                    background-color: #004080;
                }
                .success-message {
                    color: #28a745;
                    text-align: center;
                    margin-top: 10px;
                    font-weight: 500;
                    opacity: 0;
                    transition: opacity 0.3s;
                }
                .success-message.show {
                    opacity: 1;
                }
                @media (max-width: 768px) {
                    .config-wrapper {
                        grid-template-columns: 1fr;
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>📊 Word Count Widget Configuration</h1>

                <div class="config-wrapper">
                    <div class="config-panel">
                        <h2>Settings</h2>

                        <div class="form-group">
                            <label for="pageId">Notion Page ID:</label>
                            <input type="text" id="pageId" placeholder="Enter your Notion page ID" value="${process.env.NOTION_PAGE_ID || ''}">
                        </div>

                        <div class="form-group">
                            <label for="fontSize">Font Size: <span class="range-value" id="fontSizeValue">48px</span></label>
                            <input type="range" id="fontSize" min="12" max="120" value="48">
                        </div>

                        <div class="form-group">
                            <label for="color">Text Color: <span class="range-value" id="colorValue">#000000</span></label>
                            <input type="color" id="color" value="#000000">
                        </div>

                        <div class="form-group">
                            <label for="fontFamily">Font Family:</label>
                            <select id="fontFamily">
                                <option value="sans-serif">Sans-serif</option>
                                <option value="serif">Serif</option>
                                <option value="monospace">Monospace</option>
                                <option value="Georgia">Georgia</option>
                                <option value="'Times New Roman'">Times New Roman</option>
                                <option value="Arial">Arial</option>
                                <option value="Helvetica">Helvetica</option>
                                <option value="'Courier New'">Courier New</option>
                                <option value="Verdana">Verdana</option>
                            </select>
                        </div>
                    </div>

                    <div class="preview-panel">
                        <h2>Preview</h2>
                        <iframe id="preview" class="preview-iframe"></iframe>
                    </div>
                </div>

                <div class="url-section">
                    <h2>Generated URL</h2>
                    <div class="url-display" id="urlDisplay">${baseUrl}/?pageId=YOUR_PAGE_ID</div>
                    <button class="btn" onclick="copyUrl()">Copy URL for Notion</button>
                    <div class="success-message" id="successMessage">✓ Copied to clipboard!</div>
                </div>
            </div>

            <script>
                const baseUrl = '${baseUrl}';

                function updatePreview() {
                    const pageId = document.getElementById('pageId').value || 'demo';
                    const fontSize = document.getElementById('fontSize').value + 'px';
                    const colorRaw = document.getElementById('color').value;
                    const color = encodeURIComponent(colorRaw);
                    const fontFamily = document.getElementById('fontFamily').value;

                    document.getElementById('fontSizeValue').textContent = fontSize;
                    document.getElementById('colorValue').textContent = colorRaw;
                    document.getElementById('colorValue').style.color = colorRaw;

                    const url = baseUrl + '/?pageId=' + pageId +
                                '&fontSize=' + fontSize +
                                '&color=' + color +
                                '&fontFamily=' + encodeURIComponent(fontFamily);

                    document.getElementById('urlDisplay').textContent = url;
                    document.getElementById('preview').src = url;
                }

                function copyUrl() {
                    const url = document.getElementById('urlDisplay').textContent;
                    navigator.clipboard.writeText(url).then(() => {
                        const msg = document.getElementById('successMessage');
                        msg.classList.add('show');
                        setTimeout(() => msg.classList.remove('show'), 2000);
                    });
                }

                // Add event listeners
                document.getElementById('pageId').addEventListener('input', updatePreview);
                document.getElementById('fontSize').addEventListener('input', updatePreview);
                document.getElementById('color').addEventListener('input', updatePreview);
                document.getElementById('fontFamily').addEventListener('change', updatePreview);

                // Initial preview
                updatePreview();
            </script>
        </body>
        </html>
    `);
});

app.get("/", async (req, res) => {
    // Get page ID from query parameter, or fall back to environment variable
    const PAGE_ID =
        req.query.pageId || process.env.NOTION_PAGE_ID || "your-page-id-here";

    // Get styling options from query parameters
    const fontSize = req.query.fontSize || "48px";
    const color = req.query.color || "#000000";
    const fontFamily = req.query.fontFamily || "sans-serif";

    try {
        if (!process.env.NOTION_TOKEN) {
            return res.send(
                `<h1 style="font-family:sans-serif;color:red">Error: NOTION_TOKEN not configured</h1><p>Please add your Notion integration token as a secret.</p>`
            );
        }
        if (PAGE_ID === "your-page-id-here") {
            return res.send(
                `<h1 style="font-family:sans-serif;color:orange">Error: NOTION_PAGE_ID not configured</h1><p>Please add your Notion page ID as a secret.</p>`
            );
        }

        const blocks = await notion.blocks.children.list({ block_id: PAGE_ID });
        const text = blocks.results
            .map((b) =>
                b.paragraph?.rich_text?.map((rt) => rt.plain_text).join("")
            )
            .join(" ");
        const count = text.split(/\s+/).filter(Boolean).length;

        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body {
                        margin: 0;
                        padding: 10px;
                        font-family: ${fontFamily};
                    }
                    .word-count-container {
                        display: inline-flex;
                        align-items: center;
                    }
                    .word-count {
                        font-size: ${fontSize};
                        color: ${color};
                        font-family: ${fontFamily};
                        margin: 0;
                    }
                    .refresh-btn {
                        padding: 4px;
                        width: 20px;
                        height: 20px;
                        background-color: #000000;
                        color: white;
                        border: none;
                        border-radius: 50%;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: background-color 0.2s, transform 0.2s;
                        flex-shrink: 0;
                        margin-left: 10px;
                    }
                    .refresh-btn:hover {
                        background-color: #333333;
                        transform: rotate(180deg);
                    }
                    .refresh-btn svg {
                        width: 10px;
                        height: 10px;
                    }
                </style>
            </head>
            <body>
                <div class="word-count-container">
                    <h1 class="word-count">Word count: ${count}</h1>
                    <button class="refresh-btn" onclick="location.reload()" title="Refresh">
                        <svg fill="currentColor" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                            <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
                        </svg>
                    </button>
                </div>
            </body>
            </html>
        `);
    } catch (error) {
        res.send(
            `<h1 style="font-family:sans-serif;color:red">Error</h1><p>${error.message}</p>`
        );
    }
});

const PORT = 3000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});
