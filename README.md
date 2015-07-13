#FluxoReactConnectStores [![Build Status](https://travis-ci.org/samuelsimoes/fluxo-react-connect-stores.svg?branch=master)](https://travis-ci.org/samuelsimoes/fluxo-react-connect-stores)

FluxoReactConnectStores is a utility to connect your **[Fluxo](https://github.com/samuelsimoes/fluxo)** stores on your [React.js](http://facebook.github.io/react)
component.

###Installation
Install with bower and include on your page or use some module loader.
```
$ bower install --save fluxo_react_connect_stores
```

##How to use
The FluxoReactConnectStores returns a "wrapper component" around your component that
listen the stores. When a store change, this component define new props to your
component, causing the component update.

You need specify what stores you are "connecting" on your component like this:

```js
var commentStore = new Fluxo.Store();

var MyComponentConnected =
  FluxoReactConnectStores(MyComponent, { comment: commentStore });
```

The first argument are the component that you will connect and the second one is a
literal object where the key is the store name and the value is the store instance.

All connected store data will be placed on the component's props. Take a look on the
example below.

```jsx
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
var MyComponentConnected = FluxoReactConnectStores(MyComponent, { comment: comment });

// Render my connected component
React.render(<MyComponentConnected/>, document.getElementById("app"));
```

-----------------------------------------

**Samuel Simões ~ [@samuelsimoes](https://twitter.com/samuelsimoes) ~ [samuelsimoes.com](http://samuelsimoes.com)**
