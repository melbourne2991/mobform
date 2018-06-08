const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const PROJECT_PATH = __dirname;
const DIST_PATH = path.join(PROJECT_PATH, "examples_dist");
const ENTRY_PATH = path.join(PROJECT_PATH, "examples/index.ts");
const DIST_FILENAME = "bundle.js";

module.exports = {
  entry: ENTRY_PATH,
  devtool: "source-map",
  output: {
    path: DIST_PATH,
    filename: DIST_FILENAME
  },
  module: {
    rules: [
      {
        test: /\.tsx?/,
        use: ["ts-loader"]
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"]
  },
  plugins: [new HtmlWebpackPlugin()]
};
