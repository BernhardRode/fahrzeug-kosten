/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: 'class',
  plugins: [],
  safelist: [
    'text-gray-600',
    'dark:text-gray-300',
    'text-gray-900',
    'dark:text-white',
    'bg-gray-50',
    'dark:bg-gray-700',
    'font-medium',
    'font-semibold',
    'rounded-lg',
    'shadow',
    'p-4',
    'mt-8',
    'space-y-6',
    'space-y-3',
    'grid',
    'grid-cols-1',
    'md:grid-cols-2',
    'gap-6',
    'flex',
    'justify-between',
    'border-t',
    'border-gray-200',
    'dark:border-gray-600',
    'pt-2',
    'text-green-600',
    'dark:text-green-400',
    'font-bold',
    'text-xl',
    'text-lg',
    'mb-4',
    'h-80'
  ]
}