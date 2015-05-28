Angular Iron
------------

##'Lucifer, son of the morning, I'm gonna chase you out of earth'

Give your directives and controllers an Iron Shirt and they'll update themselves when their facet or cursor updates.
 
Installation
------------

```
bower install angular-iron --save
```

Usage
-----

Add 'angular-iron' to your app dependencies

```CoffeeScript
app = angular.module 'myAngularApp', ['angular-iron']
```

Configure the initial data and baobab tree options

```CoffeeScript
app.config [ 'FeProvider', (FeProvider) ->

  # Initial Data
  data = {
    someBranch: {
      someLeaf: 'My Data'
    }
  }
  # Setup a facet called 'myView'
  options = {
    facets: {
      myView: {
          cursors: {
            thing: ['someBranch','someLeaf']
          }
          get: (data) ->
            return data
        }
    }
  }
  FeProvider.setTreeConfig({data:data,options:options})
]
```

Create a directive which updates when the data in the 'myView' facet changes
 
```CoffeeScript
class MyComponent

  constructor: (@$scope, @element, @attributes, Fe) ->
    # Put on the Iron Shirt
    Fe.dress(@$scope,'myView',@update)

  update: (state) =>
    # Update the scope variable with the data in the current facet state
    @$scope.text = state.thing
    
angular.module ('myAngularApp').directive('myComponent',
  ['Fe', (Fe) ->
    return {
      # Isolated scope should be the default IMO.
      scope: {}
      template: 'MyView Thing: {{text}}'
      controller: ($scope, $element, $attrs) ->
        new MyComponent($scope, $element, $attrs, Fe)
    }
  ]
)
```

Or a controller

```CoffeeScript
class SomeRouteController

  @$inject: ['$scope','Fe']
  constructor: (@$scope, Fe) ->
    Fe.dress(@$scope, 'myView', @render)

  render: (state) =>
    # Update the scope variable with the data in the current facet state
    @$scope.text = state.thing

app.controller 'SomeRouteController', SomeRouteController
```

To update data in the tree just inject 'Fe' and use the Fe.tree property.

```CoffeeScript
class SomeService

  @$inject: ['Fe']
  constructor: (Fe) ->
    myCursor = Fe.tree.select('someBranch','someLeaf')
    myCursor.set('New Data')
```

If you only use the state data in the template (i.e. just copying from state to scope) you don't have to supply an 
update method for the 3rd parameter, just leave it and a default updater will be applied which just copies from
state to scope

```CoffeeScript
class SomeOtherController

  @$inject: ['$scope','Fe']
  constructor: (@$scope, Fe) ->
    # State from facet / cursor 'myView' will be copied into scope
    # whenever the state is updated
    Fe.dress(@$scope, 'myView')

app.controller 'SomeOtherController', SomeOtherController
```

Finally, there is a preliminary implementation of a generic directive 'fe-shirt'

```html
<div fe-shirt path="facetName" template="/path/to/template.html">
```

Which can be used if your directive template just uses data straight from state and doesn't do anything else like 
invoking actions.


Running the example
-------------------

The quickest way (at least on linux / OSX) is to use docker and docker-compose.

```
cd example
docker-compose up -d
```

Then visit localhost:9000

When you're done run

```
docker-compose stop
```
