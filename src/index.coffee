coffeescript = require 'coffee-script'

# Example
# 
#   capitalize 'test'
#   # => 'Test'
#
capitalize = (string) ->
  (string[0] or '').toUpperCase() + string[1..]

# Example
# 
#   formatClassName 'twitter_users'
#   # => 'TwitterUsers'
#
formatClassName = (filename) ->
  filename.split('_').map(capitalize).join('')

module.exports = class CoffeeScriptCompiler
  brunchPlugin: yes
  type: 'javascript'
  extension: 'coffee'

  constructor: (@config) ->
    null

  compile: (data, path, callback) ->
    try
      result = coffeescript.compile data
    catch err
      error = err
    finally
      callback error, result
