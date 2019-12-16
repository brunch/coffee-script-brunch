# coffee-script-brunch

Adds [CoffeeScript](http://coffeescript.org) support to [Brunch](https://brunch.io).

## Installation

Install the plugin via npm with `npm install coffee-script-brunch`.

Or, do manual install:

* Add `"coffee-script-brunch": "x.y.z"` to `package.json` of your brunch app.
* If you want to use git version of plugin, add
`"coffee-script-brunch": "brunch/coffee-script-brunch"`.

## Configuration

You can set the `bare` option in your brunch config (such as `brunch-config.js`):

```js
modules.exports = {
  // ...
  plugins: {
    coffeescript: {
      bare: true
    }
  }
};
```

## License

The MIT License
