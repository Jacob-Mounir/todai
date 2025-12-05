import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import TaskBoard from './TaskBoard';
import { ThemeProvider } from '../context/ThemeContext';

const renderWithTheme = (component) => {
	return render(
		<ThemeProvider>
			{component}
		</ThemeProvider>
	);
};

describe('TaskBoard Component', () => {
	const mockTasks = [
		{ id: '1', title: 'Task in Today', bucket: 'Today', importanceScore: 80, estimatedMinutes: 30 },
		{ id: '2', title: 'Task in Future', bucket: 'Future', importanceScore: 20, macroCategory: 'Chores' }
	];

	it('renders task buckets correctly', () => {
		renderWithTheme(
			<TaskBoard
				tasks={mockTasks}
				validBuckets={['Today', 'Future']}
				onAddTask={() => { }}
				onAutoOrganize={() => { }}
				isOrganizing={false}
			/>
		);

		// Check for bucket headers (headers are UPPERCASE in UI via CSS but text content is 'Today')
		// We can look for the specific headers
		const headers = screen.getAllByRole('heading', { level: 2 });
		expect(headers.some(h => h.textContent.includes('Today'))).toBe(true);
		expect(headers.some(h => h.textContent.includes('Future'))).toBe(true);
	});

	it('displays tasks in correct buckets', () => {
		renderWithTheme(
			<TaskBoard
				tasks={mockTasks}
				validBuckets={['Today', 'Future']}
				onAddTask={() => { }}
				onAutoOrganize={() => { }}
				isOrganizing={false}
			/>
		);

		expect(screen.getByText('Task in Today')).toBeInTheDocument();
		expect(screen.getByText('Task in Future')).toBeInTheDocument();
	});

	it('shows empty state message when no tasks in bucket', () => {
		renderWithTheme(
			<TaskBoard
				tasks={[]}
				validBuckets={['Today']}
				onAddTask={() => { }}
				onAutoOrganize={() => { }}
				isOrganizing={false}
			/>
		);

		expect(screen.getByText(/No tasks for today/i)).toBeInTheDocument();
	});
});
