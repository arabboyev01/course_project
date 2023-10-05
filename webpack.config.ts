import path from 'path'
import webpack from 'webpack'
import 'webpack-dev-server'
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin' // Add this import

const config: webpack.Configuration = {
    mode: 'production',
    entry: './src/server.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        plugins: [new TsconfigPathsPlugin()], // Use TsconfigPathsPlugin for path resolution
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
}

export default config
