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
    @isVendor = normalizeChecker @config?.conventions?.vendor

  compile: (data, path, callback) ->
    bare = not @isVendor path

    try
      result = coffeescript.compile data, {bare}
    catch err
      error = err
    finally
      callback error, result
