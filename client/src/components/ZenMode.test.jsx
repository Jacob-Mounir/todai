import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ZenMode from './ZenMode';
import { ThemeProvider } from '../context/ThemeContext';

// Mock canvas-confetti because it uses browser APIs not in JSDOM
vi.mock('canvas-confetti', () => ({
	default: vi.fn(),
}));

const renderWithTheme = (component) => {
	return render(
		<ThemeProvider>
			{component}
		</ThemeProvider>
	);
};

describe('ZenMode Component', () => {
	it('renders with task title', () => {
		const mockTask = { title: 'Deep Work Session' };
		renderWithTheme(<ZenMode task={mockTask} onExit={() => { }} onComplete={() => { }} />);
		expect(screen.getByText('Deep Work Session')).toBeInTheDocument();
		expect(screen.getByText('Focus Mode')).toBeInTheDocument();
	});

	it('calls onExit when exit button is clicked', () => {
		const handleExit = vi.fn();
		renderWithTheme(<ZenMode task={{ title: 'Test' }} onExit={handleExit} onComplete={() => { }} />);

		// Lucide X Icon usually renders as an SVG with specific class or role,
		// relying on button click is safer.
		const buttons = screen.getAllByRole('button');
		// The exit button is likely the first one (X), complete is main CTA.
		// Let's find by looking for the X icon or just assuming structure.
		// Actually, we can just click the one that doesn't have "Complete Task" text.
		const exitBtn = buttons.find(b => !b.textContent.includes('Complete'));
		fireEvent.click(exitBtn);

		expect(handleExit).toHaveBeenCalled();
	});

	it('triggers completion flow', async () => {
		const handleComplete = vi.fn();
		renderWithTheme(<ZenMode task={{ title: 'Test' }} onExit={() => { }} onComplete={handleComplete} />);

		fireEvent.click(screen.getByText('Complete Task'));

		// Expect confetti to be called (mocked) - implicit check
		// Expect onComplete to be called after delay
		await waitFor(() => expect(handleComplete).toHaveBeenCalled(), { timeout: 1200 });
	});
});
