(function() {
  var FeExampleActions, FeExampleController, app,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  app = angular.module('fe.example', ['angular-iron']);

  app.constant('fe.example.treeSource', {
    data: {
      a: 'Waiting for a click...',
      b: 'Some Other Data'
    },
    options: {
      facets: {
        facetA: {
          cursors: {
            foo: ['a'],
            bar: ['b']
          },
          get: function(data) {
            return data;
          }
        }
      }
    }
  });

  FeExampleActions = (function() {
    FeExampleActions.$inject = ['Fe', '$log'];

    function FeExampleActions(Fe, log) {
      this.log = log;
      this.changeState = bind(this.changeState, this);
      this.log.log('Create Example Actions');
      this.cursor = Fe.tree.select('a');
    }

    FeExampleActions.prototype.changeState = function() {
      var now;
      this.log.log('Change state');
      now = new Date();
      return this.cursor.set(now.toString());
    };

    return FeExampleActions;

  })();

  app.service('fe.example.actions', FeExampleActions);

  FeExampleController = (function() {
    FeExampleController.$inject = ['Fe', '$scope', 'fe.example.actions', '$log'];

    function FeExampleController(Fe, $scope, uiActions, log) {
      this.$scope = $scope;
      this.uiActions = uiActions;
      this.log = log;
      this.render = bind(this.render, this);
      this.log.log('Create Example Controller');
      Fe.dress(this.$scope, 'facetA', this.render);
      this.$scope.doClick = this.uiActions.changeState;
    }

    FeExampleController.prototype.render = function(state) {
      this.log.log('Render State', state);
      this.$scope.foo = state.foo;
      return this.$scope.bar = state.bar;
    };

    return FeExampleController;

  })();

  app.controller('fe.example.appController', FeExampleController);

  app.config([
    'FeProvider', 'fe.example.treeSource', function(FeProvider, treeConfig) {
      console.log('Config %O %O', FeProvider, treeConfig);
      return FeProvider.setTreeConfig(treeConfig);
    }
  ]);

}).call(this);
