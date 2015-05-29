mod = angular.module 'angular-iron', []

class Fe

  constructor: (@tree, @templateRoot) ->

  dress: (scope, facetName, renderMethod) =>
    angular.extend(@dress.caller, new IronShirt(@tree, facetName, scope, renderMethod))

mod.provider('Fe', () ->

  config = {data:{}, options: {}}
  templateRoot = ''

  @setTreeConfig = (cfg) =>
    config = cfg;

  @setTemplateRoot = (root) =>
    templateRoot = root

  @$get = ['baobab', (baobab) ->
    stateTree = baobab.create(config.data, config.options)
    fe = new Fe(stateTree, templateRoot)
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
        for key, value of state
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
    scope: {
      actions: '='
    }
    link: (scope, element, attrs) ->
      console.log('Link Fe.Shirt', scope, element, attrs)
      facetName = attrs.path || attrs.feShirt
      if not facetName
        console.error 'facet / cursor name must be supplied', scope, element, attrs
      render = (state) ->
        for key, value of state
          scope[key] = value

      Fe.dress(scope,facetName, render)

    templateUrl: (element, attrs) ->
      console.log('Template Fe.Shirt', element, attrs)
      templateName = attrs.template || attrs.path || attrs.feShirt
      if not templateName
          console.error 'No template or path attribute supplied'
          throw new Error()
      if templateName.indexOf('html') == -1
        templateName += '.html'
      return Fe.templateRoot + templateName
  }
]
