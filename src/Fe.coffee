mod = angular.module 'angular-iron', []

class Fe

  constructor: (@tree) ->

  dress: (scope, facetName, renderMethod) =>
    angular.extend(@dress.caller, new IronShirt(@tree, facetName, scope, renderMethod))

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
  constructor: (tree, facet, $scope, renderMethod) ->

    if renderMethod
      @renderMethod = renderMethod
    else
      # Supply a default render method which copies
      # data from state into $scope
      @renderMethod = (state) =>
        _.forIn state, (value, key) =>
          $scope[key] = value

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
