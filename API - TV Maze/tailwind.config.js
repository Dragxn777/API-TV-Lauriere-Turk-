/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
			bgall: 'hsl(var(--bg))',
			greenshadow: 'hsl(var(--green-shadow))',
			textcolorwhite: 'hsl(var(--text-color-white))',
	
  			
  			border: 'hsl(var(--border))',
  		},

		backgroundImage: {
			bggradient : "linear-gradient(180deg, rgba(3,19,13,1) 99%, rgba(39,233,164,0.7282562683276436) 100%);",
		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};