import { Client } from "@notionhq/client";
import "dotenv/config";
import express from "express";

const app = express();
const notion = new Client({ auth: process.env.NOTION_TOKEN });

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
                        padding: 20px;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        min-height: 100vh;
                        font-family: ${fontFamily};
                    }
                    .word-count {
                        font-size: ${fontSize};
                        color: ${color};
                        font-family: ${fontFamily};
                        margin: 0;
                        text-align: center;
                    }
                    .refresh-btn {
                        margin-top: 20px;
                        padding: 10px 20px;
                        font-size: 16px;
                        background-color: #0066cc;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                        font-family: sans-serif;
                    }
                    .refresh-btn:hover {
                        background-color: #0052a3;
                    }
                </style>
            </head>
            <body>
                <h1 class="word-count">Word count: ${count}</h1>
                <button class="refresh-btn" onclick="location.reload()">Refresh</button>
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
