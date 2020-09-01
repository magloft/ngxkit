import ts from '@wessberg/rollup-plugin-ts'

export default {
  input: 'projects/ngx-push/worker/main.ts',
  output: {
    file: 'dist/ngx-push/ngsw-worker.js',
    format: 'iife'
  },
  plugins: [ts({ browserslist: false, tsconfig: 'projects/ngx-push/tsconfig.worker.json' })]
}
