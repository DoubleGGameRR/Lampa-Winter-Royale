'use strict';

var fs = require('fs');
var path = require('path');
var vm = require('vm');
var assert = require('assert');
var source = fs.readFileSync(path.join(__dirname, '..', 'winter-royale.js'), 'utf8');
var releaseSource = fs.readFileSync(path.join(__dirname, '..', 'winter-royale-v1.0.1.js'), 'utf8');

assert.strictEqual(releaseSource, source, 'versioned release file matches the main plugin');

function classList() {
  var values = {};
  return {
    toggle: function (name, force) { values[name] = !!force; },
    contains: function (name) { return !!values[name]; }
  };
}

var ids = {};
function element(tag) {
  return {
    tagName: tag,
    id: '',
    className: '',
    children: [],
    attributes: {},
    classList: classList(),
    style: {},
    innerHTML: '',
    textContent: '',
    setAttribute: function (name, value) { this.attributes[name] = value; },
    appendChild: function (child) {
      this.children.push(child);
      if (child.id) ids[child.id] = child;
      return child;
    }
  };
}

var root = element('html');
var body = element('body');
var head = element('head');
var settings = [];
var components = [];
var storage = {};
var documentMock = {
  currentScript: {src:'https://cdn.jsdelivr.net/gh/DoubleGGameRR/Lampa-Winter-Royale@main/winter-royale.js'},
  readyState: 'complete',
  documentElement: root,
  body: body,
  head: head,
  createElement: element,
  getElementById: function (id) { return ids[id] || null; },
  addEventListener: function () {}
};
var Lampa = {
  Storage: {get:function (key, fallback) { return Object.prototype.hasOwnProperty.call(storage, key) ? storage[key] : fallback; }},
  SettingsApi: {
    addComponent:function (item) { components.push(item); },
    addParam:function (item) { settings.push(item); }
  },
  Listener: {follow:function () {}}
};
var context = {
  document: documentMock,
  Lampa: Lampa,
  window: {Lampa:Lampa,appready:true,console:{log:function(){},warn:function(){}}},
  console: console,
  setTimeout:function (fn) { fn(); }
};

vm.runInNewContext(source, context, {filename:'winter-royale.js'});

assert.strictEqual(components.length, 1, 'one settings component is registered');
assert.strictEqual(settings.length, 9, 'all Winter Royale settings are registered');
assert.ok(ids['wr-styles'], 'theme CSS is injected');
assert.ok(ids['wr-scene'], 'decorative scene is injected');
assert.ok(root.classList.contains('wr-on'), 'theme is enabled by default');
assert.ok(root.classList.contains('wr-balanced'), 'balanced TV profile is default');
assert.ok(ids['wr-scene'].innerHTML.indexOf('/assets/openmoji/tree.svg') !== -1, 'nested assets resolve next to plugin script');

storage.wr_enabled = false;
settings[0].onChange();
assert.ok(!root.classList.contains('wr-on'), 'main switch disables the theme');

vm.runInNewContext(source, context, {filename:'winter-royale-second-load.js'});
assert.strictEqual(components.length, 1, 'repeated loading is idempotent');

console.log('Winter Royale smoke tests passed');
