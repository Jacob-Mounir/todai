import React from 'react';

const DashboardLayout = ({ leftSidebar, rightSidebar, children }) => {
	return (
		<div className="flex h-screen w-full overflow-hidden">
			{/* Left Sidebar - User Context */}
			<aside className="w-80 glass-panel border-r-0 m-4 rounded-2xl hidden md:flex flex-col p-6">
				{leftSidebar}
			</aside>

			{/* Main Content - Task Lists */}
			<main className="flex-1 flex flex-col min-w-0 relative py-4">
				<div className="h-full w-full max-w-4xl mx-auto px-6 overflow-y-auto custom-scrollbar no-scrollbar">
					{children}
				</div>
			</main>

			{/* Right Sidebar - AI Chat */}
			<aside className="w-96 glass-panel border-l-0 m-4 rounded-2xl hidden lg:flex flex-col p-6">
				{rightSidebar}
			</aside>
		</div>
	);
};

export default DashboardLayout;
