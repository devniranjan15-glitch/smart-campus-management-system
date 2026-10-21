
import { createServer } from "node:http";
import { randomUUID } from "node:crypto";

const PORT = 3001;

const records = {
  notices: [],
  assignments: [],
  attendance: [],
};

const server = createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Content-Type", "application/json");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  const type = new URL(
    req.url,
    `http://localhost:${PORT}`
  ).pathname.split("/").filter(Boolean).at(-1);

  if (!Object.hasOwn(records, type)) {
    res.writeHead(404);
    return res.end(JSON.stringify({ message: "Route not found" }));
  }

  if (req.method === "GET") {
    res.writeHead(200);
    return res.end(JSON.stringify(records[type]));
  }

  if (req.method === "POST") {
    try {
      let body = "";

      for await (const chunk of req) {
        body += chunk;
      }

      const input = JSON.parse(body || "{}");
      const item = {
        ...input,
        id: randomUUID(),
        createdAt: new Date().toISOString(),
      };

      records[type].unshift(item);

      res.writeHead(201);
      return res.end(JSON.stringify(item));
    } catch {
      res.writeHead(400);
      return res.end(
        JSON.stringify({ message: "Invalid JSON body" })
      );
    }
  }

  res.writeHead(405);
  res.end(JSON.stringify({ message: "Method not allowed" }));
});

server.listen(PORT, () => {
  console.log(`Local API running at http://localhost:${PORT}`);
});
