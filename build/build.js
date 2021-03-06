var fs = require('fs');
var rollup = require('rollup');
var uglify = require('uglify-js');
var babel = require('rollup-plugin-babel');
var package = require('../package.json');
var version = process.env.VERSION || package.version;
var banner =
    "/*!\n" +
    " * vue-resource v" + version + "\n" +
    " * https://github.com/vuejs/vue-resource\n" +
    " * Released under the MIT License.\n" +
    " */\n";

// Standalone
rollup.rollup({
  entry: 'src/index.js',
  plugins: [
    babel({
      presets: ['es2015-rollup']
    })
  ]
})
.then(function (bundle) {
  return write('dist/vue-resource.js', bundle.generate({
    format: 'umd',
    banner: banner,
    moduleName: 'VueResource'
  }).code);
})
.then(function () {
  return write(
    'dist/vue-resource.min.js',
    banner + '\n' + uglify.minify('dist/vue-resource.js').code
  );
})
.catch(logError);

// CommonJS
rollup.rollup({
  entry: 'src/index.js',
  plugins: [
    babel({
      presets: ['es2015-rollup']
    })
  ]
})
.then(function (bundle) {
  return write('dist/vue-resource.common.js', bundle.generate({
    format: 'cjs',
    banner: banner
  }).code);
});

function write (dest, code) {
  return new Promise(function (resolve, reject) {
    fs.writeFile(dest, code, function (err) {
      if (err) return reject(err);
      console.log(blue(dest) + ' ' + getSize(code));
      resolve();
    });
  });
}

function getSize (code) {
  return (code.length / 1024).toFixed(2) + 'kb';
}

function logError (e) {
  console.log(e);
}

function blue (str) {
  return '\x1b[1m\x1b[34m' + str + '\x1b[39m\x1b[22m';
}
