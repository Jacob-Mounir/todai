const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function listModels() {
	const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
	const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Dummy
	console.log("Key:", process.env.GEMINI_API_KEY ? "Found" : "Missing");

	// Actually there isn't a direct listModels method on genAI instance in node SDK easily accessible?
	// Check SDK docs...
	// Actually, typically one must make a request to list models.
	// But wait, the error message SUGGESTED "Call ListModels".
	// Let's try to just use 'gemini-pro' as a fallback safe bet first.
	// or use a raw fetch to list models.
}

console.log("Checking models...");
// Just try a known older model or "gemini-pro"
console.log("Switching to gemini-pro for stability.");
