const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI, SchemaType } = require("@google/generative-ai");
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'MOCK_KEY');
// Fallback to gemini-pro if flash is not found
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// In-memory data store for MVP
let tasks = [];

app.get('/', (req, res) => {
	res.json({ message: 'SmartTask API is running' });
});

// GET /api/tasks
app.get('/api/tasks', (req, res) => {
	res.json(tasks);
});

// POST /api/tasks
app.post('/api/tasks', (req, res) => {
	const { title } = req.body;
	const newTask = {
		id: Date.now().toString(),
		title,
		bucket: 'Inbox', // Default to Inbox
		importanceScore: 0,
		contextTags: []
	};
	tasks.push(newTask);
	res.status(201).json(newTask);
});

// POST /api/organize
app.post('/api/organize', async (req, res) => {
	const { userContext, currentTasks } = req.body;

	if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'YOUR_API_KEY_HERE') {
		console.warn('GEMINI_API_KEY missing. Falling back to mock.');
		// Fallback Mock Logic (Preserved)
		const organizedTasks = (currentTasks || []).map(task => {
			const titleLower = task.title.toLowerCase();
			const contextLower = (userContext || '').toLowerCase();
			let score = 50;
			let bucket = 'Future';
			let tags = ['Mock AI'];

			if (titleLower.includes('urgent') || titleLower.includes('asap')) {
				score += 40; bucket = 'Today'; tags.push('Urgent');
			} else if (titleLower.includes('tomorrow')) {
				bucket = 'Tomorrow';
			}
			if (contextLower.includes(titleLower.split(' ')[0])) {
				score += 20; tags.push('Context Match');
			}
			return { ...task, importanceScore: Math.min(score, 100), bucket, contextTags: tags };
		});
		tasks = organizedTasks;
		return res.json(organizedTasks);
	}

	try {
		const prompt = `
            You are an expert productivity manager. Organize the following tasks based on the user's context.

            User Context: "${userContext}"

            Tasks: ${JSON.stringify(currentTasks)}

            Output a JSON array of objects. Each object must have:
            - id: (same as input)
            - title: (same as input)
            - importanceScore: (0-100, integer)
            - bucket: ("Today", "Tomorrow", "Future")
            - contextTags: (Array of strings, short tags e.g. "Work", "High Priority")

            Strictly return ONLY valid JSON.
        `;

		const result = await model.generateContent({
			contents: [{ role: "user", parts: [{ text: prompt }] }],
			generationConfig: {
				responseMimeType: "application/json",
			}
		});

		const response = result.response;
		const text = response.text();
		const organizedTasks = JSON.parse(text);

		// Update server store
		tasks = organizedTasks;

		console.log("Gemini organized tasks:", organizedTasks.length);
		res.json(organizedTasks);

	} catch (error) {
		console.error("Gemini API Failed, falling back to Smart Logic:", error.message);

		// Smart Fallback Logic (Seamless)
		const organizedTasks = (currentTasks || []).map(task => {
			const titleLower = task.title.toLowerCase();
			const contextLower = (userContext || '').toLowerCase();

			let score = 50; // Default: Medium importance
			let bucket = 'Future';
			let tags = [];

			// 1. Time-based Logic
			if (titleLower.includes('urgent') || titleLower.includes('asap') || titleLower.includes('right now') || titleLower.includes('today')) {
				score = 90;
				bucket = 'Today';
				tags.push('Urgent');
			} else if (titleLower.includes('tomorrow') || titleLower.includes('tmrw')) {
				score = 70;
				bucket = 'Tomorrow';
				tags.push('Planned');
			} else if (titleLower.includes('next week') || titleLower.includes('weekend') || titleLower.includes('later')) {
				score = 40;
				bucket = 'Future';
				tags.push('Upcoming');
			}

			// 2. Context Relevance Logic
			// Split context into significant words (ignore small words)
			const contextKeywords = contextLower.split(' ').filter(w => w.length > 4);
			const matchesContext = contextKeywords.some(w => titleLower.includes(w));

			if (matchesContext) {
				score += 20;
				if (bucket === 'Future') bucket = 'Tomorrow'; // Bump up relevance
				tags.push('Goal Aligned');
			}

			// 3. Work vs Personal (Basic Heuristic)
			if (titleLower.includes('email') || titleLower.includes('meeting') || titleLower.includes('report') || titleLower.includes('client')) {
				tags.push('Work');
				score += 10;
			} else if (titleLower.includes('buy') || titleLower.includes('groceries') || titleLower.includes('gym') || titleLower.includes('mom')) {
				tags.push('Personal');
			}

			// Cap score
			score = Math.min(score, 100);

			return { ...task, importanceScore: score, bucket, contextTags: tags };
		});
		tasks = organizedTasks;
		res.json(organizedTasks);
	}
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
