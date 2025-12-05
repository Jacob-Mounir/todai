/**
 * Client-side "Smart Sort" logic for static demos (GitHub Pages)
 * or fallback when the API is unreachable.
 */
export const organizeTasksLocally = (tasks, userContext) => {
	return tasks.map(task => {
		const titleLower = task.title.toLowerCase();
		const contextLower = (userContext || '').toLowerCase();

		let score = 50; // Default: Medium importance
		let bucket = 'Future';
		let tags = [];
		let estimate = 30; // Default 30 mins
		let macro = 'General';

		// 1. Time-based Logic
		if (titleLower.includes('urgent') || titleLower.includes('asap') || titleLower.includes('right now') || titleLower.includes('today')) {
			score = 90; bucket = 'Today'; tags.push('Urgent');
		} else if (titleLower.includes('tomorrow') || titleLower.includes('tmrw')) {
			score = 70; bucket = 'Tomorrow'; tags.push('Planned');
		} else if (titleLower.includes('next week') || titleLower.includes('weekend') || titleLower.includes('later')) {
			score = 40; bucket = 'Future'; tags.push('Upcoming');
		}

		// 2. Context Relevance Logic
		const contextKeywords = contextLower.split(' ').filter(w => w.length > 4);
		const matchesContext = contextKeywords.some(w => titleLower.includes(w));
		if (matchesContext) {
			score += 20;
			if (bucket === 'Future') bucket = 'Tomorrow';
			tags.push('Goal Aligned');
			macro = 'Main Focus';
		}

		// 3. Work vs Personal & Estimates
		if (titleLower.includes('email') || titleLower.includes('message')) {
			tags.push('Work'); score += 10; estimate = 15; macro = 'Communication';
		} else if (titleLower.includes('meeting') || titleLower.includes('call')) {
			tags.push('Work'); score += 10; estimate = 45; macro = 'Communication';
		} else if (titleLower.includes('report') || titleLower.includes('presentation') || titleLower.includes('mockup') || titleLower.includes('code')) {
			tags.push('Work'); score += 20; estimate = 60; macro = 'Deep Work';
		} else if (titleLower.includes('buy') || titleLower.includes('groceries')) {
			tags.push('Personal'); estimate = 45; macro = 'Chores';
		} else if (titleLower.includes('gym') || titleLower.includes('run') || titleLower.includes('workout')) {
			tags.push('Personal'); estimate = 60; macro = 'Health';
		}

		// Cap score
		score = Math.min(score, 100);

		return { ...task, importanceScore: score, bucket, contextTags: tags, estimatedMinutes: estimate, macroCategory: macro };
	});
};
