describe("FluxoReactConnectStores", function () {
  it("reacts on Fluxo store", function(done) {
    var person = new Fluxo.ObjectStore({ name: "Samuel" });

    var Component = React.createClass({
      displayName: "Component",

      render: function() {
        return React.createElement("p", null, this.props.person.name);
      }
    });

    Component = FluxoReactConnectStores(Component, { person: person });

    expect(Component.displayName).to.be.eql("FluxoReactConnectStores(Component)");

    var shallowRenderer = React.addons.TestUtils.createRenderer();

    shallowRenderer.render(React.createElement(Component));

    var result = shallowRenderer.getRenderOutput();

    expect(result.props.person.name).to.be.eql("Samuel");

    person.setAttribute("name", "Samuel Simões");

    setTimeout(function () {
      result = shallowRenderer.getRenderOutput();

      expect(result.props.person.name).to.be.eql("Samuel Simões");

      done();
    }, 0);
  });

  it("throws an error when receive an falsy value", function() {
    var Component = React.createClass({
      render: function() { return React.createElement("p", null, "Hello"); }
    });

    expect(function () {
      FluxoReactConnectStores(Component, { person: null });
    }).to.throw(Error, "The store \"person\" that you are trying to connect on React component is a falsy value.");
  });
});
