const path = require("path");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: "production",
  entry: {
    index: "./src/index.tsx",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    libraryTarget: "umd",
    library: "HyphenWidget",
    umdNamedDefine: true,
    globalObject: "this",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  devtool: "source-map",
  module: {
    rules: [
      { test: /\.tsx?$/, loader: "ts-loader" },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 65535,
              name: "static/media/[name].[hash:8].[ext]",
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [["autoprefixer", {}]],
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [new MiniCssExtractPlugin(), new NodePolyfillPlugin()],
};
