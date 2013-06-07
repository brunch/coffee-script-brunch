coffeescript = require 'coffee-script'

isLiterate = (path) ->
  !!path.metch /\.(litcoffee|coffee\.md)$/

normalizeChecker = (item) ->
  switch toString.call(item)
    when '[object RegExp]'
      (string) -> item.test string
    when '[object Function]'
      item
    else
      -> false

module.exports = class CoffeeScriptCompiler
  brunchPlugin: yes
  type: 'javascript'
  extension: 'coffee'
  pattern: /\.(coffee|coffee\.md|litcoffee)$/

  constructor: (@config) ->
    @isVendor = normalizeChecker @config?.conventions?.vendor

  compile: (data, path, callback) ->
    bare = not @isVendor path
    options =
      bare: not @isVendor path
      sourceMap: Boolean @config?.sourceMaps
      sourceFiles: [path]
      literate: isLiterate path

    try
      compiled = coffeescript.compile data, options
    catch err
      error = err
    finally
      result = if compiled and options.sourceMap
        code: compiled.js, map: compiled.v3SourceMap
      else
        compiled
      callback error, result
