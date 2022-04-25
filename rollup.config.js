//rollup.config.js
import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import css from 'rollup-plugin-css-only';
import { readdirSync } from 'fs';

const production = !process.env.ROLLUP_WATCH;

/*
function serve() {
  let server;

  function toExit() {
    if (server) server.kill(0);
  }

  return {
    writeBundle() {
      if (server) return;
      server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
        stdio: ['ignore', 'inherit', 'inherit'],
        shell: true
      });

      process.on('SIGTERM', toExit);
      process.on('exit', toExit);
    }
  };
}
*/
const input_path = 'src/web_components';
const output_path = './../api/src/public/static/web_components';
let entryPoints = readFiles()

function readFiles() {
  return  readdirSync(input_path)
    .filter(f => f.endsWith('.ts'))
    .filter(f => !f.endsWith('.d.ts'))
    .map(f => f.substring(0, f.indexOf('.ts')));
}

export default entryPoints.map((name, i) => {

  entryPoints = readFiles();
  let isLastFile = entryPoints.length-1 <= i;
  
  return {
    input: input_path + `/${name}.ts`,
    output: {
      sourcemap: !production,
      format: 'iife',
      name: 'app',
      file: output_path + `/${name}.js`
    },
    plugins: [
      typescript({
        sourceMap: !production,
        inlineSources: !production
      }),

      svelte({
        preprocess: sveltePreprocess({
          sourceMap: !production,
          postcss: true,
        }),
        emitCss: false,
        compilerOptions: {
          // enable run-time checks when not in production
          dev: !production
        }
      }),
      //css(),
      resolve({
        browser: true,
        dedupe: ['svelte']
      }),
      commonjs(),
      //(!production && isLastFile) && serve(),
      //(!production && isLastFile) && livereload('public'),
      production  && terser(),
    ],
    watch: {
      clearScreen: false
    }
  };
});