coffeescript = require 'coffee-script'

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

  constructor: (@config) ->
    return

  compile: (data, path, callback) ->
    try
      normalizedVendor = normalizeChecker @config?.conventions?.vendor
      bare = not normalizedVendor path
      sourceMap = @config.modules.sourceMaps
      result = coffeescript.compile data, {
        bare,
        sourceMap,
        sourceFiles:[path]
      }
      if sourceMap
        result = {
          code : result.js,
          map : result.v3SourceMap
        }
    catch err
      error = err
    finally
      callback error, result
