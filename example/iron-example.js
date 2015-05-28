(function() {
  var FeExampleActions, FeExampleController, app,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  app = angular.module('fe.example', ['angular-iron']);

  app.constant('fe.example.treeSource', {
    data: {
      currentDate: 'Dont know yet. Click the button',
      theWeather: 'Its raining.',
      username: 'Normalised'
    },
    options: {
      facets: {
        today: {
          cursors: {
            date: ['currentDate'],
            weather: ['theWeather']
          },
          get: function(data) {
            return data;
          }
        },
        userProfile: {
          cursors: {
            name: ['username']
          },
          get: function(data) {
            data.name = "Mr." + data.name;
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
      this.cursor = Fe.tree.select('currentDate');
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
      this.log.log('Create Example Controller');
      Fe.dress(this.$scope, 'today');
      this.$scope.doClick = this.uiActions.changeState;
    }

    return FeExampleController;

  })();

  app.controller('fe.example.appController', FeExampleController);

  app.config([
    'FeProvider', 'fe.example.treeSource', function(FeProvider, treeConfig) {
      console.log('Config %O %O', FeProvider, treeConfig);
      FeProvider.setTreeConfig(treeConfig);
      return FeProvider.setTemplateRoot('/templates/');
    }
  ]);

}).call(this);
