'use strict';

const coffeescript = require('coffee-script');

const isLiterate = path => /\.(litcoffee|coffee\.md)$/.test(path);

const normalizeChecker = item => {
  switch (toString.call(item)) {
    case '[object RegExp]':
      return string => item.test(string);
    case '[object Function]':
      return item;
    default:
      return () => false;
  }
};

class CoffeeScriptCompiler {
  constructor(config) {
    if (config == null) config = {};
    const plugin = config.plugins && config.plugins.coffeescript || {};
    const conv = config.conventions && config.conventions.vendor;
    this.bare = plugin.bare;
    this.sourceMaps = !!config.sourceMaps;
    this.isVendor = normalizeChecker(conv);
  }

  compile(params) {
    const data = params.data;
    const path = params.path;

    const options = {
      bare: this.bare == null ? !this.isVendor(path) : this.bare,
      sourceMap: this.sourceMaps,
      sourceFiles: [path],
      literate: isLiterate(path)
    };

    let compiled;
    try {
      compiled = coffeescript.compile(data, options);
    } catch (err) {
      const loc = err.location;
      let error;
      if (loc) {
        error = loc.first_line + ':' + loc.first_column + ' ' + (err.toString());
      } else {
        error = err.toString();
      }
      console.log('rejecting for', error);
      return Promise.reject(error);
    }
    const result = (options.sourceMap && typeof compiled === 'object') ? {
      data: compiled.js,
      map: compiled.v3SourceMap
    } : {
      data: compiled
    };
    return Promise.resolve(result);
  }
}

CoffeeScriptCompiler.prototype.brunchPlugin = true;
CoffeeScriptCompiler.prototype.type = 'javascript';
CoffeeScriptCompiler.prototype.extension = 'coffee';
CoffeeScriptCompiler.prototype.pattern = /\.(coffee(\.md)?|litcoffee)$/;

module.exports = CoffeeScriptCompiler;
