# node-xmpp-caps

XEP-0115 entity capabilities for node-xmpp

[![Build Status](https://travis-ci.org/mila-labs/node-xmpp-caps.png?branch=master)](https://travis-ci.org/mila-labs/node-xmpp-caps) [![Coverage Status](https://img.shields.io/coveralls/mila-labs/node-xmpp-caps.svg)](https://coveralls.io/r/mila-labs/node-xmpp-caps?branch=master) [![NPM Version](https://badge.fury.io/js/node-xmpp-caps.png)](https://npmjs.org/package/node-xmpp-caps)

## Usage

### Installation

```
$ npm install node-xmpp-caps
```

### Creating a `c` node

```javascript
var caps = require('node-xmpp-caps');

var c = new caps.Caps('http://code.google.com/p/exodus');
c.addIdentity('client', 'pc', 'Exodus 0.9.1');
c.addFeature('http://jabber.org/protocol/caps');
c.addFeature('http://jabber.org/protocol/disco#info');
c.addFeature('http://jabber.org/protocol/disco#items');
c.addFeature('http://jabber.org/protocol/muc');

// creates an ltx.Element instance containing this:
//
// <c xmlns='http://jabber.org/protocol/caps' 
//    hash='sha-1'
//    node='http://code.google.com/p/exodus'
//    ver='QgayPKawpkPSDYmwT/WM94uAlu0='/>
//
c.toCapsNode();
```

### Creating a `query` node

```javascript
var caps = require('node-xmpp-caps');

var c = new caps.Caps('http://code.google.com/p/exodus');
c.addIdentity('client', 'pc', 'Exodus 0.9.1');
c.addFeature('http://jabber.org/protocol/caps');
c.addFeature('http://jabber.org/protocol/disco#info');
c.addFeature('http://jabber.org/protocol/disco#items');
c.addFeature('http://jabber.org/protocol/muc');

// creates an ltx.Element instance containing this:
//
// <query xmlns='http://jabber.org/protocol/disco#info'
//        node='http://code.google.com/p/exodus#QgayPKawpkPSDYmwT/WM94uAlu0='>
//   <identity category='client' name='Exodus 0.9.1' type='pc'/>
//   <feature var='http://jabber.org/protocol/caps'/>
//   <feature var='http://jabber.org/protocol/disco#info'/>
//   <feature var='http://jabber.org/protocol/disco#items'/>
//   <feature var='http://jabber.org/protocol/muc'/>
// </query>
//
c.toQueryNode();
```

### Creating a `Caps`-Instance out of a `query` node (`ltx.Element`)

```javascript
var c = caps.fromQueryNode(queryNode);
```

## Contributing
We're happy to get contributions. If you do so, please submit a PR which has running tests
in it and that jshint doesn't complain anymore.

Thanks!

## License
MIT - See LICENSE
