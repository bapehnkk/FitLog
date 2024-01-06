/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./node_modules/tw-elements-react/dist/js/**/*.js"
    ],
    theme: {
        extend: {
            colors: {
                primary: '#004f4d', // Main color from the logo
                primaryDark: '#003834', // Darker shade for hover states or accents
                primaryLight: '#e0f2f1', // Lighter shade, good for backgrounds that need to be subtle
                primaryAccent: '#00796B', // An accent color for elements that need to stand out
                danger: '#e3342f', // Color for warning or delete actions
                backgroundMain: '#f0fdfa',
                neutral: {
                    100: '#f5f5f5', // Light shade for backgrounds
                    200: '#eeeeee', // Slightly darker shade for card headers, etc.
                    500: '#9e9e9e', // Medium shade for text
                    600: '#757575', // Dark shade for text or backgrounds
                    700: '#616161', // Darker shade for text
                    800: '#424242', // Very dark shade for text or backgrounds
                },
            },
            boxShadow: {
                'custom': '0 4px 9px -4px #3b71ca', // Custom shadow based on your logo's palette
            }
        },
    },
    darkMode: "class",
    plugins: [require("tw-elements-react/dist/plugin.cjs")]
}