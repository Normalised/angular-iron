mod = angular.module 'angular-iron'

# Converted from https://github.com/christianalfoni/baobab-angular
class BaobabService

  constructor: (@$rootScope) ->

  create: (tree, options) =>
    options = options || {}

    options.clone = true

    options.cloningFunction = (obj) ->
      return @safeDeepClone('[circular]', [], obj)

    tree = new Baobab(tree, options)

    timeoutFn = () =>
      @$rootScope.$apply()

    tree.on 'update', () ->
      setTimeout timeoutFn, 0

    return tree


  safeDeepClone: (circularValue, refs, obj) =>
    # object is a false or empty value, or otherwise not an object
    if (!obj || 'object' != typeof obj || obj instanceof Error || obj instanceof ArrayBuffer || obj instanceof Blob || obj instanceof File)
      return obj

    # Handle Date
    if (obj instanceof Date)
      copy = new Date()
      copy.setTime(obj.getTime())
      return copy

    # Handle Array - or array-like items
    if (obj instanceof Array || obj.length)

      refs.push(obj)
      copy = _.map obj, (item) =>
        if refs.indexOf(item) >= 0
          return circularValue
        else
          return @safeDeepClone(circularValue, refs, item)
      refs.pop()

      return copy

    # Handle Object
    refs.push(obj);

    # Bring along prototype
    if (obj.constructor && obj.constructor != Object)
      copy = Object.create(obj.constructor.prototype)
    else
      copy = {}

    _.each obj, (val, attr) =>
      if (obj.hasOwnProperty(attr) && attr != '$$hashKey')
        if (refs.indexOf(obj[attr]) >= 0)
          copy[attr] = circularValue;
        else
          copy[attr] = @safeDeepClone(circularValue, refs, obj[attr]);

    refs.pop();
    return copy;

mod.provider('baobab', () ->
  return {
    $get: ['$rootScope', ($rootScope) ->
      return new BaobabService($rootScope)
    ]
  }
)
