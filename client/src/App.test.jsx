import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';

// Mock child components to isolate App logic (optional but good for unit tests)
// For a smoke test, simple rendering is fine.
// However, UserContext uses textarea which is fine. FocusPlayer uses iframe.

describe('App Component', () => {
	it('renders the Dashboard Layout', async () => {
		// Mock fetch for initial task load
		global.fetch = vi.fn(() =>
			Promise.resolve({
				json: () => Promise.resolve([])
			})
		);

		render(<App />);

		// Check if main title exists (using findBy to wait for potential async updates, though title is static)
		expect(await screen.findByText(/My Tasks/i)).toBeInTheDocument();
	});
});
