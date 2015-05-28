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


# Generic Directive

mod.directive 'feShirt', ['Fe', (Fe) ->
  return {
    restrict: 'AE'
    scope: {}
    link: (scope, element, attrs) ->
      console.log('Link Fe.Shirt', scope, element, attrs)
      if not attrs.path
        console.error 'path attribute must be supplied', scope, element, attrs
      render = (state) ->
        _.forIn state, (value, key) ->
          scope[key] = value

      Fe.dress(scope,attrs.path, render)

    templateUrl: (element, attrs) ->
      console.log('Template Fe.Shirt', element, attrs)
      if not attrs.template
        console.error 'template attribute must be supplied', element, attrs
        return ''
      return attrs.template
  }
]
