app = angular.module 'fe.example', [
  'angular-iron'
]

# -------- Baobab Tree ----------
app.constant 'fe.example.treeSource', {
 data: {
   a: 'Waiting for a click...'
   b: 'Some Other Data'
 }
 options: {
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
}

# ------ UI Actions ------
class FeExampleActions

  @$inject: ['Fe','$log']
  constructor: (Fe, @log) ->
    @log.log('Create Example Actions')
    @cursor = Fe.tree.select('a')

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
    Fe.dress(@$scope,'facetA',@render)
    @$scope.doClick = @uiActions.changeState

  render: (state) =>
    @log.log('Render State',state)
    @$scope.foo = state.foo
    @$scope.bar = state.bar

app.controller 'fe.example.appController', FeExampleController

# ----- Setup Fe --------
app.config ['FeProvider', 'fe.example.treeSource', (FeProvider, treeConfig) ->
  console.log('Config %O %O',FeProvider, treeConfig)
  FeProvider.setTreeConfig(treeConfig)
]
