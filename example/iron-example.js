(function() {
  var FeExampleActions, FeExampleController, app,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  app = angular.module('fe.example', ['angular-iron']);

  app.constant('fe.example.treeSource', {
    data: {
      currentDate: 'Dont know yet. Click the button',
      theWeather: 'raining',
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
            return {
              date: data.date,
              weather: "It's " + data.weather + " right now."
            };
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
      this.changeWeather = bind(this.changeWeather, this);
      this.refreshDate = bind(this.refreshDate, this);
      this.log.log('Create Example Actions');
      this.dateCursor = Fe.tree.select('currentDate');
      this.weatherCursor = Fe.tree.select('theWeather');
    }

    FeExampleActions.prototype.refreshDate = function() {
      var now;
      this.log.log('Refresh Date');
      now = new Date();
      return this.dateCursor.set(now.toString());
    };

    FeExampleActions.prototype.changeWeather = function() {
      var choices;
      this.log.log('Change Weather');
      choices = ["raining", "sunny", "a bit windy", "very cold"];
      return this.weatherCursor.set(choices[Math.floor(Math.random() * choices.length)]);
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
      this.$scope.actions = this.uiActions;
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
