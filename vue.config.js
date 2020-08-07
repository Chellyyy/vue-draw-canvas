module.exports = {
    publicPath: '',
    pages: {
        index: {
            // 入口文件
            entry: 'examples/main.js',
            template: 'public/index.html',
            filename: 'index.html'
        }
    },
    css: {
        extract: false
    }
}