// Vercel Serverless Function — exchanges Twitter OAuth code for access token

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { code, redirect_uri, code_verifier } = req.body;

    const client_id = "VXQzYUJ4c2lvNlFwU2RLX21ZQnE6MTpjaQ"; // your real Twitter app client_id
    const client_secret = process.env.TWITTER_CLIENT_SECRET; // stored safely on Vercel

    const tokenUrl = "https://api.x.com/2/oauth2/token";
    const basicAuth = Buffer.from(`${client_id}:${client_secret}`).toString("base64");

    const params = new URLSearchParams({
      code,
      grant_type: "authorization_code",
      redirect_uri,
      code_verifier,
    });

    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${basicAuth}`,
      },
      body: params,
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    console.error("Token exchange failed:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
