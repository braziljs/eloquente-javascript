import {nodeResolve} from "@rollup/plugin-node-resolve"
import terser from "@rollup/plugin-terser"

export default {
  input: "src/client/index.mjs",
  output: {
    file: "html/ejs.js",
    format: "umd"
  },
  plugins: [nodeResolve(), terser()]
}
