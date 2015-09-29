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
  var extend = function(toExtend) {
    toExtend = toExtend || {};

    var extensions = Array.prototype.slice.call(arguments, 1);

    for (var i = 0, l = extensions.length; i < l; i++) {
      var extension = extensions[i];

      for (var extensionProperty in extension) {
        toExtend[extensionProperty] = extension[extensionProperty];
      }
    }

    return toExtend;
  };

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
  return {
    createClass: function (extension) {
      return React.createClass(extend({}, this, extension));
    },

    getChildContext: function () {
      return { actions: this.actions };
    },

    childContextTypes: {
      actions: React.PropTypes.object
    },

    getStores: function () {
      return {};
    },

    getActions: function () {
      return {};
    },

    getInitialState: function() {
      var state = {};

      for (var storeName in this.stores) {
        var store = this.stores[storeName];
        state[storeName] = store.toJSON();
      }

      return state;
    },

    renderRequestQueuedStores: function() {
      var state = {};

      for (var i = 0, l = this.renderRequestQueue.length; i < l; i++) {
        var storeName = this.renderRequestQueue[i];
        state[storeName] = this.stores[storeName].toJSON();
      }

      this.setState(state);

      this.renderRequestQueue = [];
    },

    queueRenderRequest: function(storeName) {
      if (this.renderRequestQueue.indexOf(storeName) === -1) {
        this.renderRequestQueue.push(storeName);
      }

      if (!this.consumeQueueNextTick) {
        this.consumeQueueNextTick = setTimeout(this.consumeQueue, 0);
      }
    },

    consumeQueue: function() {
      this.renderRequestQueuedStores();
      delete this.consumeQueueNextTick;
    },

    componentWillMount: function() {
      this.storesOnChangeCancelers = [];
      this.renderRequestQueue = [];
      this.stores = this.getStores();
      this.actions = this.getActions();

      for (var storeName in this.stores) {
        var store = this.stores[storeName];
        this.listenStore(storeName, store);
      }
    },

    listenStore: function(storeName, store) {
      var canceler =
        store.on(
          ["change", "stores:change"],
          this.queueRenderRequest.bind(null, storeName)
        );

      this.storesOnChangeCancelers.push(canceler);
    },

    componentWillUnmount: function() {
      this.cancelListening();
    },

    cancelListening: function () {
      for (var i = 0, l = this.storesOnChangeCancelers.length; i < l; i++) {
        this.storesOnChangeCancelers[i].call();
      }
    },

    render: function() {
      return React.createElement(this.props.component, extend({}, this.props, this.state));
    }
  };
});
