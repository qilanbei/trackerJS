import path from "path"
import ts from "rollup-plugin-typescript2"
import dts from "rollup-plugin-dts"

export default [
  {
    input: "./src/core/index.ts",
    output: [
      // es：支持import export
      {
        file: path.resolve(__dirname, "./dist/index.esm.js"),
        format: "es",
      },
      // cjs：支持require exports
      {
        file: path.resolve(__dirname, "./dist/index.cjs.js"),
        format: "cjs",
      },
      // umd：支持AMD、CMD、global  支持 script 引用
      {
        file: path.resolve(__dirname, "./dist/index.js"),
        format: "umd",
        name: "tracker",
      },
    ],
    plugins: [ts()], // 帮我们去读取 tsconfig.json
  },
  {
    input: "./src/core/index.ts",
    output: [
      {
        file: path.resolve(__dirname, "./dist/index.d.js"),
      },
    ],
    plugins: [dts()], // 帮我们去读取 tsconfig.json
  },
]
