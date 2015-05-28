app = angular.module 'fe.example', [
  'angular-iron'
]

# -------- Baobab Tree ----------
app.constant 'fe.example.treeSource', {
  data: {
    currentDate: 'Dont know yet. Click the button'
    theWeather: 'Its raining.'
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
          return data
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
    @cursor = Fe.tree.select('currentDate')

  changeState: () =>
    @log.log('Change state')
    now = new Date()
    @cursor.set(now.toString())

app.service 'fe.example.actions', FeExampleActions

# ------ Basic Controller ------------
class FeExampleController

  @$inject: ['Fe','$scope','fe.example.actions','$log']
  constructor: (Fe, @$scope, @uiActions, @log) ->
    @log.log('Create Example Controller')

    # Note, no update method supplied so state is just copied to $scope
    Fe.dress(@$scope,'today')

    @$scope.doClick = @uiActions.changeState

app.controller 'fe.example.appController', FeExampleController

# ----- Setup Fe --------
app.config ['FeProvider', 'fe.example.treeSource', (FeProvider, treeConfig) ->
  console.log('Config %O %O',FeProvider, treeConfig)
  FeProvider.setTreeConfig(treeConfig)
  FeProvider.setTemplateRoot('/templates/')
]
