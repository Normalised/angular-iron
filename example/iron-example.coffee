app = angular.module 'angular-iron.example', [
  'angular-iron'
]

# -------- Baobab Tree ----------
app.constant 'fe.example.treeSource', () ->
  return {
    a: 'Unknown'
    b: 'bar'
    facets : {
      facetA: {
        cursors: {
          foo: ['a']
          bar: ['b']
        }
        get : (data) ->
          return data
      }
    }
  }

# ------ UI Actions ------
class FeExampleActions

  @$inject: ['Fe']
  constructor: (@Fe) ->

  changeState: () =>
    a = @Fe.tree.select('a')
    now = new Date()
    a.set(now.toString())

app.service 'fe.example.actions', FeExampleActions

# ------ Basic Controller ------------
class FeExampleController

  @$inject: ['Fe','$scope','FeExampleActions']
  constructor: (@Fe, @$scope, @uiActions) ->

app.controller 'fe.example.appController', FeExampleController

# ----- Setup Fe --------
app.config ['FeProvider', (FeProvider) ->

  FeProvider.tree = 'fe.example.treeSource'
]
