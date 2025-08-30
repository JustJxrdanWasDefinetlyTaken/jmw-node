import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
import wisp from "wisp-server-node";
import express from "express";
import { createServer } from "node:http";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static(join(fileURLToPath(import.meta.url), "../public/")));
app.use("/mux/", express.static(baremuxPath));
app.use("/epoxy/", express.static(epoxyPath));

app.post("/api/chat", async (req, res) => {
  try {
    const { model, messages, temperature = 0.8, max_tokens = 1024 } = req.body;
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ model, messages, temperature, max_tokens })
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const server = createServer();

server.on("request", (req, res) => {
  app(req, res);
});
server.on("upgrade", (req, socket, head) => {
  if (req.url.endsWith("/wisp/")) {
    wisp.routeRequest(req, socket, head);
  } else {
    socket.end();
  }
});

server.listen(4141, () => {
  console.log("running on port 4141 [did unc finally snap?]");
  console.log("http://localhost:4141");
});
