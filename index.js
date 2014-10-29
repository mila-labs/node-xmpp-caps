/**
 * XEP-0115 Entity capabilities implementation
 *
 * @author Michael Weibel <michael.weibel@gmail.com>
 * @copyright Mila AG
 * @license MIT
 */
'use strict';

var crypto = require('crypto')
  , Element = require('ltx').Element;

function sortProperty(array, property) {
  array.sort(function(a, b) {
    if(a[property] > b[property]) {
      return -1;
    }
    if(a[property] < b[property]) {
      return 1;
    }
    return 0;
  });
}

function sortIdentities(ids) {
  sortProperty(ids, 'category');
  sortProperty(ids, 'type');
  sortProperty(ids, 'lang');
}

/**
 * Capabilities
 *
 * @param {String} node Software identifier
 * @param {String} [hash=sha-1] Hash to generate the version string (only sha-1 supported as of now)
 * @constructor
 */
function Caps(node, hash) {
  this.hash = (hash || 'sha-1').toLowerCase();

  if(this.hash !== 'sha-1') {
    throw new Error('Invalid argument provided for hash. Only sha-1 suported');
  }

  this.node = node;
  this.identities = [];
  this.features = [];
}

/**
 * Add an identity
 *
 * @param {String} category
 * @param {String} type
 * @param {String} [name]
 * @param {String} [lang]
 *
 * @returns {Caps}
 */
Caps.prototype.addIdentity = function(category, type, name, lang) {
  this.identities.push({
    category: category,
    type: type,
    lang: lang,
    name: name
  });

  return this;
};

/**
 * Add supported feature
 *
 * @param {String} name Feature name (aka 'var')
 *
 * @returns {Caps}
 */
Caps.prototype.addFeature = function(name) {
  this.features.push(name);

  return this;
};

/**
 * Generates the version hash
 * @returns {String}
 */
Caps.prototype.generateVersionHash = function() {
  var str = '';

  sortIdentities(this.identities);
  this.features.sort();

  this.identities.forEach(function(id) {
    str += id.category + '/' + id.type + '/' +
      (id.lang || '') + '/' + (id.name || '');
    str += '<';
  });
  str += this.features.join('<');
  str += '<';

  var ver = crypto.createHash('sha1');
  ver.update(str);
  ver = ver.digest('base64').toString();
  return ver;
};

/**
 * Creates a 'c' node to be used in presence stanzas.
 *
 * @returns {Object}
 */
Caps.prototype.toCapsNode = function() {
  return new Element('c', {
    xmlns: 'http://jabber.org/protocol/caps',
    hash: this.hash,
    node: this.node,
    ver: this.generateVersionHash()
  });
};

/**
 * Generates a disco#info query node from the identities and features we got.
 *
 * @returns {Element}
 */
Caps.prototype.toQueryNode = function() {
  var el = new Element('query', {
    xmlns: 'http://jabber.org/protocol/disco#info',
    node: this.node + '#' + this.generateVersionHash()
  });

  this.identities.forEach(function(id) {
    el.c('identity', id).up();
  });
  this.features.forEach(function(name) {
    el.c('feature', {
      var: name
    }).up();
  });

  return el;
};

/**
 * Creates a {Caps} from an XML node
 *
 * @param {Object} node
 *
 * @returns {Caps}
 */
function fromQueryNode(query) {
  var node = query.attrs.node.split('#')[0];
  var caps = new Caps(node);
  var identities = query.getChildren('identity');
  var features = query.getChildren('feature');

  identities.forEach(function(id) {
    caps.addIdentity(id.attrs.category, id.attrs.type, id.attrs.name, id.attrs.lang);
  });
  features.forEach(function(feature) {
    caps.addFeature(feature.attrs.var);
  });

  return caps;
}

module.exports = {
  Caps: Caps,
  fromQueryNode: fromQueryNode
};
