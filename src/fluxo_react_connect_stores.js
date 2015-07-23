(function(root, factory) {
  if (typeof define === "function" && define.amd) {
    define(["react", "fluxo"], factory);
  } else if (typeof exports !== "undefined") {
    var React = require("react"),
        Fluxo = require("fluxo");
    return module.exports = factory(React, Fluxo);
  } else {
    root.FluxoReactConnectStores = factory(root.React, root.Fluxo);
  }
})(this, function(React, Fluxo) {
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
    /** @lends Fluxo.ConnectStores */
    return React.createClass({
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

      updateComponentState: function() {
        this.setState(this.storesState);
      },

      componentWillMount: function() {
        for (var storeName in stores) {
          var store = stores[storeName];
          this.listenStore(store);
        }
      },

      listenStore: function(store) {
        var canceler = store.on(["change", "stores:change"], this.updateComponentState);
        this.storesOnChangeCancelers.push(canceler);
      },

      componentWillUnmount: function() {
        for (var i = 0, l = this.storesOnChangeCancelers.length; i < l; i ++) {
          this.storesOnChangeCancelers[i].call();
        }
      },

      render: function() {
        return React.createElement(Component, Fluxo.extend({}, this.props, this.state));
      }
    });
  };
});
