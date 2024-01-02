import { NextApiRequest, NextApiResponse } from "next";

const SibApiV3Sdk = require("sib-api-v3-typescript");

const apiInstance = new SibApiV3Sdk.ContactsApi();

// Setup API key
function setupApiKey() {
  const apiKey = apiInstance.authentications["apiKey"];
  apiKey.apiKey = process.env.BREVO;
}

// GET Function
export async function GET(
  limit: number,
  offset: number,
  modifiedSince: string
): Promise<Response> {
  setupApiKey();
  try {
    const data = await apiInstance.getContacts(limit, offset, modifiedSince);
    console.log("API called successfully. Returned data: ", data);
    return new Response(JSON.stringify(data.body), { status: 200 });
  } catch (error: any) {
    console.error(error);
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}

// POST Function
export async function POST(req: NextApiRequest): Promise<Response> {
  const createContact = new SibApiV3Sdk.CreateContact();
  const { email } = req.body;

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return Response.json({ message: "Invalid or missing email" });
  }

  createContact.email = email;
  createContact.listIds = [2];
  createContact.emailBlacklisted = false;

  setupApiKey();

  try {
    console.log("Sending data to API: ", createContact);
    const data = await apiInstance.createContact(createContact);
    console.log("API called successfully. Returned data: ", data);
    return new Response(JSON.stringify(data.body), { status: 200 });
  } catch (error: any) {
    console.error(error);
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}

// UPDATE Function
export async function UPDATE(
  identifier: string,
  email: string,
  firstname: string
): Promise<Response> {
  const updateContact = new SibApiV3Sdk.UpdateContact();
  updateContact.attributes = { EMAIL: email, FIRSTNAME: firstname };

  setupApiKey();

  try {
    await apiInstance.updateContact(identifier, updateContact);
    console.log("API called successfully.");
    return new Response(null, { status: 204 });
  } catch (error: any) {
    console.error(error);
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}

// DELETE Function
export async function DELETE(identifier: string): Promise<Response> {
  setupApiKey();

  try {
    await apiInstance.deleteContact(identifier);
    console.log("API called successfully.");
    return new Response(null, { status: 204 });
  } catch (error: any) {
    console.error(error);
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}
