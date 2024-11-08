import type { ModuleOptions } from "webpack"

export const rules: Required<ModuleOptions>["rules"] = [
  // Add support for native node modules
  {
    // We're specifying native_modules in the test because the asset relocator loader generates a
    // "fake" .node file which is really a cjs file.
    test: /native_modules[/\\].+\.node$/,
    use: "node-loader",
  },
  {
    test: /[/\\]node_modules[/\\].+\.(m?js|node)$/,
    parser: { amd: false },
    use: {
      loader: "@vercel/webpack-asset-relocator-loader",
      options: {
        outputAssetBase: "native_modules",
      },
    },
  },
  {
    test: /\.tsx?$/,
    exclude: /(node_modules|\.webpack)/,
    use: {
      loader: "ts-loader",
      options: {
        transpileOnly: true,
      },
    },
  },
  {
    test: /\.s[ac]ss$/i,
    use: [
      // Creates `style` nodes from JS strings
      "style-loader",
      // Translates CSS into CommonJS
      "css-loader",
      {
        loader: "postcss-loader",
        options: {
          postcssOptions: {
            plugins: ["tailwindcss", "autoprefixer"],
          },
        },
      },
      // Compiles Sass to CSS
      "sass-loader",
    ],
  },
  {
    test: /\.(woff|woff2|eot|ttf|otf)$/, // Match font file extensions
    type: "asset/resource", // For Webpack 5
    // For Webpack 4 and below, use the following instead:
    // use: {
    //   loader: 'file-loader',
    //   options: {
    //     name: '[name].[ext]',
    //     outputPath: 'fonts/',
    //   },
    // },
  },
  {
    test: /\.css$/i,
    exclude: /node_modules/,
    use: [
      "style-loader",
      "css-loader",
      {
        loader: "postcss-loader",
        options: {
          postcssOptions: {
            plugins: ["tailwindcss", "autoprefixer"],
          },
        },
      },
    ],
  },
  // Rule for CSS files in node_modules
  {
    test: /\.css$/i,
    include: /node_modules/,
    use: ["style-loader", "css-loader"],
  },
]
