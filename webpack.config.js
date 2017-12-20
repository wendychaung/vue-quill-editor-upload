const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const entries = getEntry('src/js/*.js', 'src/js/');
const chunks = Object.keys(entries);
const config = {
	entry: entries,

    output: {
		path: path.join(__dirname, 'dist'),
		publicPath:'',
		filename: 'js/[name].js'
	},
	resolve: {
		alias: {
			'vue$': 'vue/dist/vue.common.js'
		}
	},
	module: {
		rules: [
			{
				test: /\.json$/,
				loader: 'file-loader',
				query:{
					name: 'json/[hash].[ext]',
					publicPath:'../',
					limit: 1
				}
			},
            {
                test: /\.(ttf|eot|woff|woff2)$/,
                loader: 'file-loader?name=fonts/[name].[ext]'
            },
			{
				test: /\.css$/,
				use:
					ExtractTextPlugin.extract({fallback:'style-loader', use:'css-loader?minimize'})
			},
			{
				test: /\.scss$/,
				use:
					ExtractTextPlugin.extract(
						{
							use:'css-loader?minimize!sass-loader',
                            publicPath: "../"
						}
						)
			},
            {
                test:/\.vue$/,
                loader:"vue-loader",
                options: {
                    loaders: {
                        css: ExtractTextPlugin.extract({
                            use: 'css-loader?minimize!sass-loader',
                            fallback: 'vue-style-loader'
                        })
                    }
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015', 'stage-0']
                }
            },
			{
				test: /\.html$/,
				use: "html-loader?attrs=img:src img:data-src"
			},
			{
				test: /\.(jpe?g|png|gif|svg)$/,
				use: {
					loader: 'file-loader',
					options: {
						name: 'images/[hash].[ext]',
						limit: 2
					}
				}
			}
		]
	},
	plugins: [
		new webpack.ProvidePlugin({
			$: 'jquery',
            jQuery: "jquery",
			"window.$": "jquery",
			"window.jQuery": "jquery"
		}),
		new CommonsChunkPlugin({
			name: 'vendor',
            minChunks: function (module) {
                if(module.resource && (/^.*\.(css|scss)$/).test(module.resource)) {
                    return false;
                }
                return module.context && module.context.indexOf("node_modules") !== -1;
            }
		}),
		new ExtractTextPlugin('css/[name].css'),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.SourceMapDevToolPlugin({
            test: [/\.js$/, /\.jsx$/],
			exclude: 'vendor',
            filename: "js/[name].js.map",
            append: "//# sourceMappingURL=[url]",
            moduleFilenameTemplate: '[resource-path]',
            fallbackModuleFilenameTemplate: '[resource-path]'
        })
	],
	devServer: {
        proxy: {
            "/api": {
                target: "http://localhost:8282"
            }
        },
		contentBase: path.join(__dirname, "dist"),
		inline: true,
		hot: false,
		// host: "http://localhost",
		port: 9094
	}
};
const pages = Object.keys(getEntry('src/**/*.html', 'src/'));
pages.forEach(function(pathname) {
    let conf = {
		filename: pathname + '.html',
		template: 'src/' + pathname + '.html',
		inject: 'body',
		minify: {
			removeComments: true,
			collapseWhitespace: true,
            minifyJs:true
		}
	};
	if (pathname in config.entry) {
		conf.inject = 'body';
		conf.chunks = ['vendor', pathname];
		conf.hash = true;
	}
	config.plugins.push(new HtmlWebpackPlugin(conf));
});
module.exports = config;
function getEntry(globPath, pathDir) {
    let files = glob.sync(globPath);
    let entries = {},
		entry, dirname, basename, pathname, extname;
	for (let i = 0; i < files.length; i++) {
		entry = files[i];
		dirname = path.dirname(entry);
		extname = path.extname(entry);
		basename = path.basename(entry, extname);
		pathname = path.normalize(path.join(dirname,  basename));
		pathDir = path.normalize(pathDir);
		if(pathname.startsWith(pathDir)){
			pathname = pathname.substring(pathDir.length)
		}
		entries[pathname] = ['./' + entry];
	}
	return entries;
}
