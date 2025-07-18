function requireApiKey(req, res, next) {
    console.log("🔐 Middleware called! Checking API key...");
    console.log("Provided key:", req.headers['x-api-key']);
    console.log("Expected key:", process.env.API_KEY);
    
    const providedKey = req.headers['x-api-key'];
    const correctKey = process.env.API_KEY;
    
    if (!providedKey) {
        console.log("❌ No API key provided");
        return res.status(401).json({ error: "API Key is missing" });
    }
    
    if (providedKey !== correctKey) {
        console.log("❌ API key invalid");
        return res.status(403).json({ error: "API Key is invalid" });
    }
    
    console.log("✅ API key valid");
    next();
}

module.exports = {requireApiKey};