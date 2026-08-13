// --- ABY PRIVACY TOKEN ENGINE ---
const Ably = require('ably');

exports.handler = async (event, context) => {
    // If someone tries to mess with your server connection, reject them
    if (!process.env.ABLY_API_KEY) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Missing secret server security key." })
        };
    }

    try {
        // Initialize Ably using your private hidden environment variable key
        const client = new Ably.Realtime(process.env.ABLY_API_KEY);
        
        // Generate an encrypted short-term token for the user browser
        const tokenParams = { clientId: 'aim-user-' + Math.random().toString(36).substring(7) };
        const tokenData = await client.auth.createTokenRequest(tokenParams);
        
        // Securely pass the encrypted access token back to the chat room page
        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(tokenData)
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message })
        };
    }
};
