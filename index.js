'use strict';

const coffee = require('coffee-script');
const normalizeChecker = checker => {
  if (typeof checker === 'function') return checker;
  if (checker instanceof RegExp) return path => checker.test(path);

  return () => false;
};

class CoffeeScriptCompiler {
  constructor(config) {
    const plugin = config.plugins.coffeescript || {};
    this.bare = plugin.bare;
    this.sourceMaps = config.sourceMaps;
    this.isVendor = normalizeChecker(config.conventions.vendor);
  }

  compile(file) {
    const data = file.data;
    const path = file.path;

    const options = {
      filename: path,
      sourceFiles: [path],
      bare: this.bare == null ? !this.isVendor(path) : this.bare,
      literate: coffee.helpers.isLiterate(path),
    };

    if (this.sourceMaps === 'inline') {
      options.inlineMap = true;
    } else if (this.sourceMaps) {
      options.sourceMap = true;
    }

    try {
      var compiled = coffee.compile(data, options);
    } catch (err) {
      const loc = err.location;
      if (loc) {
        err.line = loc.first_line + 1;
        err.col = loc.first_column + 1;
      }

      return Promise.reject(err);
    }

    const result = typeof compiled === 'string' ?
      {data: compiled} :
      {data: compiled.js, map: compiled.v3SourceMap};

    return Promise.resolve(result);
  }
}

CoffeeScriptCompiler.prototype.brunchPlugin = true;
CoffeeScriptCompiler.prototype.type = 'javascript';
CoffeeScriptCompiler.prototype.pattern = /\.(coffee(\.md)?|litcoffee)$/;

module.exports = CoffeeScriptCompiler;
