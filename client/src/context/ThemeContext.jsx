import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
	const [theme, setTheme] = useState('dark'); // 'dark' | 'soft'

	// New States for Gradient Maker
	const [customGradient, setCustomGradient] = useState(() => {
		return localStorage.getItem('theme_custom_gradient') || null;
	});
	const [cardTransparency, setCardTransparency] = useState(() => {
		return localStorage.getItem('theme_card_transparency') === 'true';
	});

	// Persistence
	useEffect(() => {
		if (customGradient) localStorage.setItem('theme_custom_gradient', customGradient);
		else localStorage.removeItem('theme_custom_gradient');
	}, [customGradient]);

	useEffect(() => {
		localStorage.setItem('theme_card_transparency', cardTransparency);
	}, [cardTransparency]);


	const toggleTheme = () => {
		setTheme(prev => prev === 'dark' ? 'soft' : 'dark');
		// Optional: Clear custom gradient when switching themes?
		// For now let's keep it as an override layer.
	};

	const toggleCardTransparency = () => {
		setCardTransparency(prev => !prev);
	};

	const themeClasses = {
		dark: {
			bg: 'bg-black',
			text: 'text-white',
			panel: 'glass-panel',
			gradientText: 'text-transparent bg-clip-text bg-gradient-to-br from-white via-white/90 to-white/50',
			sidebar: 'glass-panel',
			accent: 'indigo'
		},
		soft: {
			bg: 'bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100',
			text: 'text-slate-800',
			panel: 'bg-white/40 backdrop-blur-xl border border-white/40 shadow-xl',
			gradientText: 'text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600',
			sidebar: 'bg-white/30 backdrop-blur-lg border border-white/20',
			accent: 'purple'
		}
	};

	return (
		<ThemeContext.Provider value={{
			theme,
			toggleTheme,
			styles: themeClasses[theme],
			customGradient,
			setCustomGradient,
			cardTransparency,
			toggleCardTransparency
		}}>
			{children}
		</ThemeContext.Provider>
	);
};
