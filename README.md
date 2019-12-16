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

[Transpilation](http://coffeescript.org/#transpilation) is also supported. You
can set `transpile` to `true` to let babel find its configuration in the normal
way or you can pass a configuration directly. Make sure you have `@babel/core`
and any relevant plugins installed.

```js
modules.exports = {
  // ...
  plugins: {
    coffeescript: {
      transpile: true,
      // or:
      // transpile: {presets: ["@babel/env"]}
    }
  }
};
```

## License

The MIT License
