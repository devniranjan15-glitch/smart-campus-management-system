
import { randomUUID } from "node:crypto";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";

const client = DynamoDBDocumentClient.from(
  new DynamoDBClient({})
);

const TABLE_NAME = process.env.TABLE_NAME;

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type,authorization",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
};

const response = (statusCode, body) => ({
  statusCode,
  headers,
  body: JSON.stringify(body),
});

const cleanString = (value, max = 300) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

export const handler = async (event) => {
  try {
    const method =
      event.requestContext?.http?.method || event.httpMethod;

    if (method === "OPTIONS") {
      return response(204, {});
    }

    const path = (event.rawPath || event.path || "/")
      .replace(/\/+$/, "");

    const type = path.split("/").filter(Boolean).at(-1);

    if (!["notices", "assignments", "attendance"].includes(type)) {
      return response(404, { message: "Route not found" });
    }

    if (!TABLE_NAME) {
      console.error("TABLE_NAME environment variable is missing");
      return response(500, { message: "Server configuration error" });
    }

    if (method === "GET") {
      const result = await client.send(
        new QueryCommand({
          TableName: TABLE_NAME,
          KeyConditionExpression: "recordType = :type",
          ExpressionAttributeValues: {
            ":type": type,
          },
          Limit: 100,
        })
      );

      return response(200, result.Items || []);
    }

    if (method !== "POST") {
      return response(405, { message: "Method not allowed" });
    }

    let input;

    try {
      input = JSON.parse(event.body || "{}");
    } catch {
      return response(400, { message: "Invalid JSON body" });
    }

    const item = {
      recordType: type,
      id: randomUUID(),
      createdAt: new Date().toISOString(),
    };

    if (type === "notices") {
      item.title = cleanString(input.title, 120);
      item.detail = cleanString(input.detail, 1000);
      item.date = cleanString(input.date, 30);

      if (!item.title || !item.detail) {
        return response(400, {
          message: "title and detail are required",
        });
      }
    }

    if (type === "assignments") {
      item.subject = cleanString(input.subject, 100);
      item.task = cleanString(input.task, 300);
      item.due = cleanString(input.due, 30);
      item.status =
        input.status === "Completed" ? "Completed" : "Pending";

      if (!item.subject || !item.task || !item.due) {
        return response(400, {
          message: "subject, task and due are required",
        });
      }
    }

    if (type === "attendance") {
      item.subject = cleanString(input.subject, 100);
      item.attended = Number(input.attended);
      item.total = Number(input.total);

      if (
        !item.subject ||
        !Number.isInteger(item.attended) ||
        !Number.isInteger(item.total) ||
        item.attended < 0 ||
        item.total < 0 ||
        item.attended > item.total
      ) {
        return response(400, {
          message: "Provide a subject and valid attendance counts",
        });
      }
    }

    await client.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: item,
      })
    );

    return response(201, item);
  } catch (error) {
    console.error("Request failed:", error);
    return response(500, { message: "Internal server error" });
  }
};
