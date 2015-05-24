mod = angular.module 'angular-iron', []

class Fe

  constructor: (@tree) ->

  dress: (scope, facetName, renderMethod) =>
    angular.extend(@dress.caller, new IronShirt(facetName, scope, renderMethod, @tree))

mod.provider('Fe', () ->

  config = {data:{}, options: {}}

  @setTreeConfig = (cfg) =>
    config = cfg;

  @$get = ['baobab', (baobab) ->
    stateTree = baobab.create(config.data, config.options)
    return new Fe(stateTree)
  ]

  return @
)

class IronShirt
  constructor: (facet, $scope, @renderMethod, tree) ->
    # Check if its a faceted state
    if tree.facets[facet]
      ironState = tree.facets[facet]
    else
      # If its not faceted then treat it as a path for a cursor
      ironState = tree.select(facet)

    @renderMethod(ironState.get())
    ironState.on 'update', @stateChanged
    $scope.$on '$destroy', () =>
      ironState.off 'update', @stateChanged

  stateChanged: (event) =>
    state = event.target.get()
    @renderMethod(state)
