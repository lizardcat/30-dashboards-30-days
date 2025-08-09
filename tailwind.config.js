/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
        colors: {
            'dashboard-dark': '#0f172a',
            'dashboard-card': '#1e293b',
            'dashboard-border': '#334155',
            'dashboard-accent': '#3b82f6',
        }
        },
    },
    plugins: [],
}