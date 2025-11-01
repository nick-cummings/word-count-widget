import { Client } from "@notionhq/client";
import express from "express";

const app = express();
const notion = new Client({ auth: process.env.NOTION_TOKEN });
const PAGE_ID = "your-page-id-here";

app.get("/", async (req, res) => {
    const blocks = await notion.blocks.children.list({ block_id: PAGE_ID });
    const text = blocks.results
        .map((b) => b.paragraph?.rich_text?.map((rt) => rt.plain_text).join(""))
        .join(" ");
    const count = text.split(/\s+/).filter(Boolean).length;
    res.send(`<h1 style="font-family:sans-serif">Word count: ${count}</h1>`);
});

app.listen(3000);
