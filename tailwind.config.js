module.exports = {
    darkMode: 'class',
    content: [
        './src/**/*.{js,jsx,ts,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                'koru-blue': 'var(--koru-color-blue)',
                'koru-blue-dark': 'var(--koru-color-blue-dark)',
                'koru-gray': 'var(--koru-color-gray)',
                'koru-gray-light': 'var(--koru-color-gray-light)',
                'koru-gray-lighter': 'var(--koru-color-gray-lighter)',
                'koru-purple': 'var(--koru-color-purple)',
                'koru-purple-dark': 'var(--koru-color-purple-dark)',
                'koru-brown': 'var(--koru-color-brown)',
                'koru-pink': 'var(--koru-color-pink)',
                'koru-red': 'var(--koru-color-red)',
                'koru-red-dark': 'var(--koru-color-red-dark)',
                'koru-red-light': 'var(--koru-color-red-light)',
                'koru-green': 'var(--koru-color-green)',
                'koru-yellow': 'var(--koru-color-yellow)',
            },
        },
    },
    plugins: [],
}
