coffeescript = require 'coffee-script'

isLiterate = (path) ->
  /\.(litcoffee|coffee\.md)$/.test(path)

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
    bare = @config?.plugins?.coffeescript?.bare
    # Use this vendor test only if bare isn't explicitly set
    bare = not @isVendor path unless bare?
    options =
      bare: bare
      sourceMap: Boolean @config?.sourceMaps
      sourceFiles: [path]
      literate: isLiterate path

    try
      compiled = coffeescript.compile data, options
    catch err
      error = if err.location?
        "#{err.location.first_line}:#{err.location.first_column} #{err.toString()}"
      else
        err.toString()
    finally
      return callback error if error?
      result = if compiled and options.sourceMap
        data: compiled.js,
        map: compiled.v3SourceMap
      else
        data: compiled
      callback error, result
