coffeescript = require 'coffee-script'

normalizeChecker = (item) ->
  switch toString.call(item)
    when '[object RegExp]'
      (string) -> item.test string
    when '[object Function]'
      item
    else
      throw new Error("Config item #{item} is invalid.
Use RegExp or Function.")

module.exports = class CoffeeScriptCompiler
  brunchPlugin: yes
  type: 'javascript'
  extension: 'coffee'

  constructor: (@config) ->
    return

  compile: (data, path, callback) ->
    normalizedVendor = normalizeChecker @config.conventions.vendor
    bare = not normalizedVendor path
    try
      result = coffeescript.compile data, bare: bare
    catch err
      error = err
    finally
      callback error, result
