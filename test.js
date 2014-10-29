/**
 * XEP-0115 Entity capabilities implementation
 *
 * @author Michael Weibel <michael.weibel@gmail.com>
 * @copyright Mila AG
 * @license MIT
 */

'use strict';

/* global describe, it */

var assert = require('assert')
  , caps = require('./');

var QUERY_NODE = '<query xmlns="http://jabber.org/protocol/disco#info" ' +
  'node="http://code.google.com/p/exodus#QgayPKawpkPSDYmwT/WM94uAlu0=">' +
    '<identity category="client" type="pc" name="Exodus 0.9.1"/>' +
    '<feature var="http://jabber.org/protocol/caps"/>' +
    '<feature var="http://jabber.org/protocol/disco#info"/>' +
    '<feature var="http://jabber.org/protocol/disco#items"/>' +
    '<feature var="http://jabber.org/protocol/muc"/>' +
  '</query>';

function createTestCapsNode() {
  // used the same values as in the XEP
  var c = new caps.Caps('http://code.google.com/p/exodus');
  c.addIdentity('client', 'pc', 'Exodus 0.9.1');
  c.addFeature('http://jabber.org/protocol/caps');
  c.addFeature('http://jabber.org/protocol/disco#info');
  c.addFeature('http://jabber.org/protocol/disco#items');
  c.addFeature('http://jabber.org/protocol/muc');
  return c;
}

describe('Caps', function() {
  describe('#toCapsNode()', function() {
    it('should return the correct caps node', function() {
      // used the same values as in the XEP
      var c = createTestCapsNode();
      var el = c.toCapsNode();

      assert.equal('http://jabber.org/protocol/caps', el.attrs.xmlns);
      assert.equal('sha-1', el.attrs.hash);
      assert.equal('http://code.google.com/p/exodus', el.attrs.node);
      assert.equal('QgayPKawpkPSDYmwT/WM94uAlu0=', el.attrs.ver);
    });
  });
  describe('#toQueryNode()', function() {
    it('should return a proper XML ELement', function() {
      var c = createTestCapsNode();
      var str = c.toQueryNode().toString();

      assert.equal(QUERY_NODE, str);
    });
  });
});
describe('fromQueryNode', function() {
  it('should create a valid Caps Node with the correct version hash out of it', function() {
    var c = caps.fromQueryNode(createTestCapsNode().toQueryNode());
    var str = c.toQueryNode().toString();

    assert.equal(QUERY_NODE, str);
  });
});
