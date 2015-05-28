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

*All code examples are CoffeeScript*

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

If you only use the state data in the template, i.e. copying from state to scope, you don't have to supply an 
update method for the 3rd parameter.

```CoffeeScript
class SomeOtherController

  @$inject: ['$scope','Fe']
  constructor: (@$scope, Fe) ->
    # State from facet / cursor 'myView' will be copied into scope
    # whenever the state is updated
    Fe.dress(@$scope, 'myView')

app.controller 'SomeOtherController', SomeOtherController
```

Mutating the state tree
-----------------------

To update data in the tree just inject 'Fe' and use the Fe.tree property.

```CoffeeScript
class SomeService

  @$inject: ['Fe']
  constructor: (Fe) ->
    myCursor = Fe.tree.select('someBranch','someLeaf')
    myCursor.set('New Data')
```

Iron Shirt Directive
--------------------

Finally, there is a preliminary implementation of a generic directive 'fe-shirt' which can be used if your directive 
template only uses data straight from state and doesn't do anything else like invoking actions.

The simplest form for fe-shirt is :

```html
<div fe-shirt="someName">
```
In this case the attribute is used for both the facet / cursor name AND for the template (by appending .html to the name)

Template locations can be configured via the FeProvider :

```CoffeeScript
FeProvider.setTemplateRoot('/my/template/path/')
```

Both the data path and template can be configured separately via the path and template attributes :

```html
<div fe-shirt path="facetName" template="/path/to/template.html">
```

If the template attribute is not supplied the path attribute is checked and then the fe-shirt attribute.

NOTE : If any setting for template doesnt contain .html it will be appended to the template name

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
