'use strict';

var path = require('path')

var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var merge = require('webpack-merge')
var minimist = require('minimist')

var pkg = require('./package.json')

var process_arguments = minimist(process.argv.slice(2))

var TARGET = process_arguments.action

// if not process_arguments.target
//   console.log 'Target required.'
//   console.log 'Usage: webpack --target=[build|build-minified]'
//   return

// var TARGET = process.env.TARGET
var ROOT_PATH = path.resolve(__dirname)
var DEMO_DIR = 'demo'
var config = 
{
    paths: 
    {
        dist: path.join(ROOT_PATH, 'build'),
        src: path.join(ROOT_PATH, 'source'),
        demo: path.join(ROOT_PATH, DEMO_DIR),
        demoIndex: path.join(ROOT_PATH, DEMO_DIR, '/index')
    },
    filename: 'react-styling',
    library: 'react-styling'
}

var mergeDemo = merge.bind(null, 
{
    resolve: 
    {
        extensions: ['', '.js', '.jsx', '.md', '.css', '.png', '.jpg']
    },
    module: 
    {
        loaders: 
        [
            {
                test: /\.css$/,
                loaders: ['style', 'css']
            },
            {
                test: /\.md$/,
                loaders: ['html', 'highlight', 'markdown']
            },
            {
                test: /\.png$/,
                loader: 'url?limit=100000&mimetype=image/png',
                include: config.paths.demo
            },
            {
                test: /\.jpg$/,
                loader: 'file',
                include: config.paths.demo
            },
            {
                test: /\.json$/,
                loader: 'json'
            }
        ]
    }
})

if (TARGET === 'dev') 
{
    var IP = '0.0.0.0'
    var PORT = 3000

    module.exports = mergeDemo
    ({
        ip: IP,
        port: PORT,
        devtool: 'eval',
        entry: 
        [
            'webpack-dev-server/client?http://' + IP + ':' + PORT,
            'webpack/hot/only-dev-server',
            config.paths.demoIndex
        ],
        output: 
        {
            path: __dirname,
            filename: 'bundle.js',
            publicPath: '/'
        },
        plugins: 
        [
            new webpack.DefinePlugin
            ({
                'process.env': 
                {
                    'NODE_ENV': JSON.stringify('development'),
                }
            }),
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoErrorsPlugin(),
            new HtmlWebpackPlugin()
        ],
        module: 
        {
            preLoaders: 
            [
                {
                    test: /\.jsx?$/,
                    loaders: ['eslint', 'jscs'],
                    include: [config.paths.demo, config.paths.src]
                }
            ],
            loaders: 
            [
                {
                    test: /\.jsx?$/,
                    loaders: ['react-hot', 'babel'],
                    include: [config.paths.demo, config.paths.src]
                }
            ]
        }
    })
}

if (TARGET === 'gh-pages') 
{
    module.exports = mergeDemo
    ({
        entry: 
        {
            app: config.paths.demoIndex,
            // tweak this to include your externs unless you load them some other way
            vendors: ['react/addons']
        },
        output: 
        {
            path: './gh-pages',
            filename: 'bundle.[chunkhash].js'
        },
        plugins: 
        [
            new webpack.DefinePlugin
            ({
                'process.env': 
                {
                    // This has effect on the react lib size
                    'NODE_ENV': JSON.stringify('production'),
                }
            }),
            new webpack.optimize.DedupePlugin(),
            new webpack.optimize.UglifyJsPlugin
            ({
                compress: 
                {
                    warnings: false
                }
            }),
            new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.[chunkhash].js'),
            new HtmlWebpackPlugin
            ({
                title: pkg.name + ' - ' + pkg.description
            })
        ],
        module: 
        {
            loaders: 
            [
                {
                    test: /\.jsx?$/,
                    loaders: ['babel'],
                    include: [config.paths.demo, config.paths.src]
                }
            ]
        }
    })
}

var mergeDist = merge.bind(null, 
{
    devtool: 'source-map',
    output: 
    {
        path: config.paths.dist,
        libraryTarget: 'umd',
        library: config.library
    },
    entry: config.paths.src,
    externals: 
    {
        //// if you are not testing, just react will do
        //react: 'react',
        // 'react/addons': 'react/addons'
    },
    module: 
    {
        loaders: 
        [
            {
                test: /\.jsx?$/,
                loaders: ['babel'],
                include: config.paths.src
            }
        ]
    }
})

if (TARGET === 'build') 
{
    module.exports = mergeDist
    ({
        output: 
        {
            filename: config.filename + '.js'
        }
    })
}

if (TARGET === 'build-minified') 
{
    module.exports = mergeDist
    ({
        output: 
        {
            filename: config.filename + '.minified.js'
        },
        plugins: 
        [
            new webpack.optimize.UglifyJsPlugin
            ({
                compress: 
                {
                    warnings: false
                }
            })
        ]
    })
}