var fs = require('fs');
var project = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

module.exports = {
    get env() {
        return process.env.NODE_ENV || 'production';
    },
    get dest() {
        return (process.env.NODE_ENV === 'development' ? 'dev' : 'dist');
    },
    src: 'src',
    browsers: [
        'last 2 versions',
        'not ie < 11'
    ],
    name: project.name,
    version: project.version,
    license: project.license,
    watchOpts: {
        interval: 300,
        binaryInterval: 600,
        usePolling: true,
        useFsEvents: true,
        awaitWriteFinish: true
    }
};
