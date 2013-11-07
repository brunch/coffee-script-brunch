describe('Plugin', function() {
  var plugin;

  beforeEach(function() {
    plugin = new Plugin({});
  });

  it('should be an object', function() {
    expect(plugin).to.be.ok;
  });

  it('should has #compile method', function() {
    expect(plugin.compile).to.be.an.instanceof(Function);
  });

  it('should compile and produce valid result', function(done) {
    var content = 'a = 1';
    var expected = 'var a;\n\na = 1;\n';

    plugin.compile(content, 'file.coffee', function(error, data) {
      expect(error).not.to.be.ok;
      expect(data.data).to.equal(expected);
      done();
    });
  });

  it('should compile literal source and produce valid result', function(done)
  {
    var content = 'I am a literal string\n\n    a = 1';
    var expected = 'var a;\n\na = 1;\n';

    plugin.compile(content, 'file.litcoffee', function(error, data) {
      expect(error).not.to.be.ok;
      expect(data.data).to.equal(expected);
      done();
    });
  });

  it('should produce source maps', function(done) {
    plugin = new Plugin({sourceMaps: true});

    var content = 'a = 1';
    var expected = 'var a;\n\na = 1;\n';

    plugin.compile(content, 'file.coffee', function(error, data) {
      expect(error).not.to.be.ok;
      expect(data.data).to.equal(expected);
      expect(data.map).to.be.a('string');
      done();
    });
  });

  it('should support explicit bare setting', function(done) {
    plugin = new Plugin({plugins:{coffeescript:{bare:false}}});

    var content = 'a = 1';
    var expected = '(function() {\n  var a;\n\n  a = 1;\n\n}).call(this);\n';

    plugin.compile(content, 'file.coffee', function(error, data) {
      expect(error).not.to.be.ok;
      expect(data.data).to.equal(expected);

      plugin = new Plugin({plugins:{coffeescript:{bare:true}}});
      content = 'a = 1';
      expected = 'var a;\n\na = 1;\n';

      plugin.compile(content, 'file.coffee', function(error, data) {
        expect(error).not.to.be.ok;
        expect(data.data).to.equal(expected);
        done();
      });
    });
  });
});
