import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/kit/vite';
/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter(),
    alias: {
      '$comp': './src/comp',
      '$lib': './src/lib',
      '$types': './src/types',
    }
  },
  preprocess: vitePreprocess()
};
export default config;
