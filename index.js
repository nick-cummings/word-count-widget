import { Client } from "@notionhq/client";
import "dotenv/config";
import express from "express";

const app = express();
const notion = new Client({ auth: process.env.NOTION_TOKEN });

app.get("/", async (req, res) => {
    // Get page ID from query parameter, or fall back to environment variable
    const PAGE_ID =
        req.query.pageId || process.env.NOTION_PAGE_ID || "your-page-id-here";

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
        res.send(
            `<h1 style="font-family:sans-serif">Word count: ${count}</h1>`
        );
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
