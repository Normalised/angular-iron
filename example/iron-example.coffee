app = angular.module 'fe.example', [
  'angular-iron'
]

# -------- Baobab Tree ----------
app.constant 'fe.example.treeSource', {
  data: {
    currentDate: 'Dont know yet. Click the button'
    theWeather: 'raining'
    username: 'Normalised'
  }
  options: {
    facets: {
      today: {
        cursors: {
          # In this case the facet just aliases the properties with new names
          date: ['currentDate']
          weather: ['theWeather']
        }
        get: (data) ->
          # You can manipulate the data however you like here
          return {
            date: data.date
            weather: "It's " + data.weather + " right now."
          }
      }
      userProfile: {
        cursors: {
          name:['username']
        }
        get: (data) ->
          data.name = "Mr." + data.name
          return data
      }
    }
  }
}

# ------ UI Actions ------
class FeExampleActions

  @$inject: ['Fe','$log']
  constructor: (Fe, @log) ->
    @log.log('Create Example Actions')
    @dateCursor = Fe.tree.select('currentDate')
    @weatherCursor  = Fe.tree.select('theWeather')

  refreshDate: () =>
    @log.log('Refresh Date')
    now = new Date()
    @dateCursor.set(now.toString())

  changeWeather: () =>
    @log.log('Change Weather')
    choices = ["raining","sunny","a bit windy","very cold"]
    @weatherCursor.set(choices[Math.floor(Math.random() * choices.length)])

app.service 'fe.example.actions', FeExampleActions

# ------ Basic Controller ------------
class FeExampleController

  @$inject: ['Fe','$scope','fe.example.actions','$log']
  constructor: (Fe, @$scope, @uiActions, @log) ->
    @log.log('Create Example Controller')

    # Note, no update method supplied so state is just copied to $scope
    Fe.dress(@$scope,'today')

    @$scope.actions = @uiActions

app.controller 'fe.example.appController', FeExampleController

# ----- Setup Fe --------
app.config ['FeProvider', 'fe.example.treeSource', (FeProvider, treeConfig) ->
  console.log('Config %O %O',FeProvider, treeConfig)
  FeProvider.setTreeConfig(treeConfig)
  FeProvider.setTemplateRoot('/templates/')
]
