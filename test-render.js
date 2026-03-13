import React from 'react';
import { renderToString } from 'react-dom/server';
import Dashboard from './resources/js/Pages/Dashboard.jsx';

// Mock inertia
global.__inertia = true;
global.route = () => '/dummy';

const props = {
    auth: { user: { email: 'test@admin.com' } },
    activities: [],
    monthlyStats: [],
    selectedYear: 2026
};

try {
    const html = renderToString(React.createElement(Dashboard, props));
    console.log('Render success, length:', html.length);
} catch (e) {
    console.error('Render failed:', e);
}
