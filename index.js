'use strict';

const compile = require('coffee-script').compile;
const normalizeChecker = checker => {
  if (typeof checker === 'function') return checker;
  if (checker instanceof RegExp) return path => checker.test(path);

  return () => false;
};

class CoffeeScriptCompiler {
  constructor(config) {
    const plugin = config.plugins.coffeescript || {};
    this.bare = plugin.bare;
    this.header = plugin.header;
    this.sourceMaps = config.sourceMaps;
    this.isVendor = normalizeChecker(config.conventions.vendor);
  }

  compile(file) {
    const data = file.data;
    const path = file.path;

    const options = {
      filename: path,
      bare: this.bare == null ? !this.isVendor(path) : this.bare,
      header: this.header,
    };

    if (this.sourceMaps === 'inline') {
      options.inlineMap = true;
    } else if (this.sourceMaps) {
      options.sourceMap = true;
    }

    try {
      var compiled = compile(data, options);
    } catch (err) {
      const loc = err.location;
      const message = loc ?
        `${loc.first_line}:${loc.first_column} ${err}` :
        `${err}`;

      return Promise.reject(message);
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
