const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');

const glob = createGlobPatternsForDependencies(__dirname);
console.log('🚀 ~ file: tailwind.config.js:5 ~ glob:', glob);

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    join(
      __dirname,
      '../keep-time-picker/{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    ...glob,
  ],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui'), require('tailwind-scrollbar')],
};
