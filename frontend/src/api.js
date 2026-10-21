
const API_BASE_URL = "http://localhost:3001";

export async function getRecords(type) {
  const response = await fetch(`${API_BASE_URL}/${type}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${type}`);
  }

  return response.json();
}

export async function createRecord(type, data) {
  const response = await fetch(`${API_BASE_URL}/${type}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to create ${type}`);
  }

  return response.json();
}
