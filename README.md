#FluxoReactConnectStores [![Build Status](https://travis-ci.org/samuelsimoes/fluxo-react-connect-stores.svg?branch=master)](https://travis-ci.org/samuelsimoes/fluxo-react-connect-stores)

FluxoReactConnectStores is a utility to connect your **[Fluxo](https://github.com/samuelsimoes/fluxo)** stores on your [React.js](http://facebook.github.io/react)
component.

###Installation
Install with bower or npm and include on your app with some module loader
(browserify/webpack/require.js) or include directly on your app through script tag.
```
$ bower install --save fluxo_react_connect_stores
```
or
```
$ npm install --save fluxo-react-connect-stores
```

####Using with CommonJS module loaders (Webpack/Browserify)
```js
var Connector = require("fluxo-react-connect-stores");
Connector(MyComponent, { comments: commentsStore });
```

####Using with \<script\> tag
If you include the connector with script tag the connector will be available through
`window.FluxoReactConnectStores`.

##How to use
The `FluxoReactConnectStores` returns a "wrapper component" around your component that
listens to the stores. When a store change, this component define new props to your
component, causing the component update.

You need specify what stores you are "connecting" on your component like this:

```js
var Connector = require("fluxo-react-connect-stores");

var commentStore = new Fluxo.ObjectStore();

var MyComponentConnected =
  Connector(MyComponent, { comment: commentStore });
```

The first argument is the component that you will connect and the second one is a
literal object where the key is the store name and the value is the store instance.

All connected store data will be placed on the component's props. Take a look on the
example below.

```jsx
var Connector = require("fluxo-react-connect-stores");

// A new instance of Fluxo.Store
var comment = new Fluxo.Store({ content: "My comment" });

// My component
var MyComponent = React.createClass({
  render: function() {
    // Present my store using the object on "this.props.comment"
    return <p>{this.props.comment.content}</p>;
  }
});

// Connect my store on my component
var MyComponentConnected = Connector(MyComponent, { comment: comment });

// Render my connected component
React.render(<MyComponentConnected/>, document.getElementById("app"));
```
###View layer update
Whenever your Fluxo stores change, the view layer will be updated with the new stores state. The `FluxoReactConnectStores` is smart enough to only call `setState` once per tick, in other words, **no matter who many times you change your store on the tick, only one `setState` will be invoked on view layer** with the resulting stores state, improving the view layer performance.

-----------------------------------------

**Samuel Simões ~ [@samuelsimoes](https://twitter.com/samuelsimoes) ~ [samuelsimoes.com](http://samuelsimoes.com)**
