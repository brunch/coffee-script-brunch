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
  generators:
    backbone:
      model: (name) ->
        """module.exports = class #{formatClassName name} extends Backbone.Model"""

      view: (name) ->
        """template = require 'views/templates/#{name}'

module.exports = class #{formatClassName name}View extends Backbone.View
  template: template
"""

    chaplin:
      controller: (name) ->
        """Controller = require 'controllers/controller'
#{formatClassName name} = 'models/#{name}'
#{formatClassName name}View = require 'views/#{name}_view'

module.exports = class #{formatClassName name}Controller extends Controller
  historyURL: ''
"""
      model: (name) ->
        """Model = require 'models/model'

module.exports = class #{formatClassName name} extends Model
"""

      view: (name) ->
        """View = require 'views/view'
template = require 'views/templates/#{name}'

module.exports = class #{formatClassName name}View extends View
  template: template
"""

  constructor: (@config) ->
    null

  compile: (data, path, callback) ->
    try
      result = coffeescript.compile data
    catch err
      error = err
    finally
      callback error, result
