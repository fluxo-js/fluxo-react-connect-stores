(function(root, factory) {
  if (typeof define === "function" && define.amd) {
    define(["react"], factory);
  } else if (typeof exports !== "undefined") {
    var React = require("react");
    return module.exports = factory(React);
  } else {
    root.FluxoReactConnectStores = factory(root.React);
  }
})(this, function(React) {
  /**
   * FluxoReactConnectStores is a function to connect your Fluxo stores on your
   * React.js component. This method returns a "wrapper component" around to
   * your component that listen the stores. When a store change, this component
   * define new props to your component, causing the component update.
   *
   * @param {function} Component - Component constructor that you want connect
   *
   * @param {Object.<string, (Fluxo.Store|Fluxo.CollectionStore)>} stores - Literal
   * object with the stores to connect. The key will be used to expose the store
   * data on the component's props and the value must be a Fluxo store instance.
   *
   * @returns {function} Wrapped component constructor function.
   */
  return function (Component, stores) {
    for (var store in stores) {
      if (!stores[store]) {
        throw new Error(("The store \"" + store + "\" that you are trying to connect on React component is a falsy value."));
      }
    }

    /** @lends Fluxo.ConnectStores */
    return React.createClass({
      displayName: "FluxoReactConnectStores(" + Component.displayName + ")",

      storesOnChangeCancelers: [],

      getInitialState: function() {
        return this.storesState();
      },

      storesState: function() {
        var state = {};

        for (var storeName in stores) {
          var store = stores[storeName];
          state[storeName] = store.toJSON();
        }

        return state;
      },

      componentWillMount: function() {
        for (var storeName in stores) {
          var store = stores[storeName];
          this.listenStore(storeName, store);
        }
      },

      listenStore: function(storeName, store) {
        var canceler =
          store.on(["change"], function () {
            this.setState(this.storesState());
          }.bind(this));
        this.storesOnChangeCancelers.push(canceler);
      },

      componentWillUnmount: function() {
        for (var i = 0, l = this.storesOnChangeCancelers.length; i < l; i++) {
          this.storesOnChangeCancelers[i].call();
        }
      },

      render: function() {
        var propsToComponent = {};

        // convert to spread when use ES6
        for (var prop in this.props) {
          propsToComponent[prop] = this.props[prop];
        }

        for (var state in this.state) {
          propsToComponent[state] = this.state[state];
        }

        return React.createElement(Component, propsToComponent);
      }
    });
  };
});
