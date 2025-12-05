import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
	const [theme, setTheme] = useState('dark'); // 'dark' | 'soft'

	const toggleTheme = () => {
		setTheme(prev => prev === 'dark' ? 'soft' : 'dark');
	};

	const themeClasses = {
		dark: {
			bg: 'bg-black',
			text: 'text-white',
			panel: 'glass-panel', // existing glass panel
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
		<ThemeContext.Provider value={{ theme, toggleTheme, styles: themeClasses[theme] }}>
			{children}
		</ThemeContext.Provider>
	);
};
