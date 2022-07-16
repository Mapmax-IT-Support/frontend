import React, { Children, Component } from 'react';
import PropTypes from 'prop-types';
import Async from 'react-promise';
import invariant from 'invariant';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var objectWithoutProperties = function (obj, keys) {
  var target = {};

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

function urlBuilder(property, value, separator) {
  if (value) {
    return '' + property + separator + value;
  }

  return null;
}

function locationBuilder(location) {
  var urlParts = [];

  if (Array.isArray(location)) {
    var arrParts = location.map(function (val) {
      return locationBuilder(val);
    });
    urlParts.push.apply(urlParts, toConsumableArray(arrParts));
  }

  if (typeof location === 'string' || typeof location === 'number') {
    urlParts.push(location);
  }

  if ((typeof location === 'undefined' ? 'undefined' : _typeof(location)) === 'object' && location.lat && location.lng) {
    urlParts.push(location.lat + ',' + location.lng);
  }

  return urlParts.join('%7C'); // |
}

function isStatelessComponent(component) {
  return !component.render && !(component.prototype && component.prototype.render);
}

function isClassComponent(component) {
  return Boolean(component && component.prototype.isReactComponent && component.prototype.render);
}

function renderStatelessComponent(component, props) {
  return component(props);
}

function renderClassComponent(component, props) {
  return new component(props).render();
}

var markerStrategy = function markerStrategy(_ref, parentProps) {
  var props = _ref.props,
      defaultProps = _ref.type.defaultProps;
  var size = props.size,
      color = props.color,
      label = props.label,
      anchor = props.anchor,
      iconURL = props.iconURL,
      location = props.location,
      scale = props.scale;


  invariant(location, 'Marker expects a valid location prop');

  var urlParts = [];

  // Todo: Remove the property if the defaultProp and Prop value is the same

  urlParts.push(urlBuilder('size', size, ':'));
  urlParts.push(urlBuilder('color', color, ':'));
  urlParts.push(urlBuilder('label', label, ':'));
  urlParts.push(urlBuilder('anchor', anchor, ':'));
  urlParts.push(urlBuilder('scale', scale, ':'));
  urlParts.push(urlBuilder('icon', iconURL, ':'));
  urlParts.push(urlBuilder('', locationBuilder(location), ''));

  var url = urlParts.filter(function (x) {
    return x;
  }).join('%7C'); // |

  return 'markers=' + url;
};

var pathStrategy = function pathStrategy(_ref, parentProps) {
  var props = _ref.props,
      defaultProps = _ref.type.defaultProps;
  var weight = props.weight,
      color = props.color,
      fillcolor = props.fillcolor,
      geodesic = props.geodesic,
      points = props.points;


  invariant(points, 'Path expects a valid points prop');

  var urlParts = [];
  // Todo: Remove the property if the defaultProp and Prop value is the same

  urlParts.push(urlBuilder('color', color, ':'));
  urlParts.push(urlBuilder('weight', weight, ':'));
  urlParts.push(urlBuilder('fillcolor', fillcolor, ':'));
  urlParts.push(urlBuilder('geodesic', geodesic, ':'));
  urlParts.push(urlBuilder('', locationBuilder(points), ''));

  var url = urlParts.filter(function (x) {
    return x;
  }).join('%7C'); //|

  return 'path=' + url;
};

var markerGroupStrategy = function markerGroupStrategy(_ref, parentProps) {
  var props = _ref.props,
      defaultProps = _ref.type.defaultProps;
  var size = props.size,
      color = props.color,
      label = props.label,
      anchor = props.anchor,
      iconURL = props.iconURL,
      children = props.children,
      scale = props.scale;


  var location = Children.map(children, function (child) {
    return child.props.location;
  });

  return markerStrategy({
    props: { size: size, color: color, label: label, anchor: anchor, iconURL: iconURL, location: location, scale: scale },
    type: { defaultProps: defaultProps }
  });
};

var pathGroupStrategy = function pathGroupStrategy(_ref, parentProps) {
  var props = _ref.props,
      defaultProps = _ref.type.defaultProps;
  var weight = props.weight,
      color = props.color,
      fillcolor = props.fillcolor,
      geodesic = props.geodesic,
      children = props.children;


  var points = Children.map(children, function (child) {
    return child.props.points;
  });

  return pathStrategy({
    props: { weight: weight, color: color, fillcolor: fillcolor, geodesic: geodesic, points: points },
    type: { defaultProps: defaultProps }
  });
};

function nativeStrategy(data) {
  var origin = data.origin,
      destination = data.destination,
      travelMode = data.travelMode;


  var originLocation = void 0;
  var destinationLocation = void 0;

  if ((typeof origin === 'undefined' ? 'undefined' : _typeof(origin)) === 'object' && origin.lat && origin.lng) {
    originLocation = new google.maps.LatLng(origin);
  } else {
    originLocation = origin;
  }

  if ((typeof destination === 'undefined' ? 'undefined' : _typeof(destination)) === 'object' && destination.lat && destination.lng) {
    destinationLocation = new google.maps.LatLng(destination);
  } else {
    destinationLocation = destination;
  }

  var DirectionsService = new google.maps.DirectionsService();
  return new Promise(function (resolve, reject) {
    DirectionsService.route({
      origin: originLocation,
      destination: destinationLocation,
      travelMode: travelMode.toUpperCase()
    }, function (result, status) {
      if (status === google.maps.DirectionsStatus.OK) {
        resolve(result.routes[0].overview_polyline);
      }

      reject(status);
    });
  });
}

function fetchStrategy(data) {
  var baseURL = data.baseURL,
      key = data.key,
      origin = data.origin,
      destination = data.destination;


  var options = {
    method: 'GET',
    mode: 'cors',
    cache: 'default'
  };

  var originLocation = void 0;
  var destinationLocation = void 0;

  if ((typeof origin === 'undefined' ? 'undefined' : _typeof(origin)) === 'object' && origin.lat && origin.lng) {
    originLocation = origin.lat + ',' + origin.lng;
  } else {
    originLocation = origin;
  }

  if ((typeof destination === 'undefined' ? 'undefined' : _typeof(destination)) === 'object' && destination.lat && destination.lng) {
    destinationLocation = destination.lat + ',' + destination.lng;
  } else {
    destinationLocation = destination;
  }

  var URL = baseURL + '?origin=' + originLocation + '&destination=' + destinationLocation + '&key=' + key;

  return fetch(URL, options).then(function (res) {
    return res.json();
  }).then(function (res) {
    return res.routes[0].overview_polyline.points;
  });
}

var memoizeDirectionStrategy = function memoizeDirectionStrategy(directionStrategy) {
  var cache = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  return function (_ref, parentProps) {
    var props = _ref.props;

    var key = JSON.stringify(props);
    if (cache[key]) {
      return cache[key];
    } else {
      var promise = directionStrategy.apply(null, arguments).then(function (strat) {
        // When this finally resolves, set the value of the cache to
        // the string path result. Subsequent renders will return a string
        // and use the base component instead of the Async component and
        // not cause the flash
        cache[key] = strat;
        if (parentProps.onCacheUpdate) {
          parentProps.onCacheUpdate(_extends({}, cache));
        }
        return strat;
      });
      // Return the pending promise immedietly and the StaticGoogleMap
      // usage of the Async component will eventually handle it because
      // this function returned a Promise. This piece of the code prevents
      // multiple calls to google on each render, but does not solve the
      // "flash" of the Async component.
      cache[key] = promise;
      return promise;
    }
  };
};

var directionStrategy = function directionStrategy(_ref2, parentProps) {
  var props = _ref2.props,
      defaultProps = _ref2.type.defaultProps;
  var baseURL = props.baseURL,
      requestStrategy = props.requestStrategy,
      origin = props.origin,
      destination = props.destination,
      apiKey = props.apiKey,
      waypoints = props.waypoints,
      avoid = props.avoid,
      travelMode = props.travelMode,
      transitMode = props.transitMode,
      transitRoutingPreference = props.transitRoutingPreference,
      weight = props.weight,
      color = props.color,
      fillcolor = props.fillcolor,
      geodesic = props.geodesic,
      rest = objectWithoutProperties(props, ['baseURL', 'requestStrategy', 'origin', 'destination', 'apiKey', 'waypoints', 'avoid', 'travelMode', 'transitMode', 'transitRoutingPreference', 'weight', 'color', 'fillcolor', 'geodesic']);


  invariant(origin, 'Origin prop is required');
  invariant(destination, 'Destination prop is required');

  // Use the parent's API key if one isn't set here.
  var key = apiKey ? apiKey : parentProps ? parentProps.apiKey : '';

  var data = _extends({
    key: key,
    baseURL: baseURL,
    origin: origin,
    destination: destination,
    waypoints: waypoints,
    avoid: avoid,
    travelMode: travelMode,
    transitMode: transitMode,
    transitRoutingPreference: transitRoutingPreference
  }, rest);

  var pathPromise = void 0;

  if (typeof requestStrategy !== 'string') {
    pathPromise = requestStrategy(data);
  } else {
    switch (requestStrategy) {
      case 'native':
        pathPromise = nativeStrategy(data);
        break;
      case 'fetch':
        pathPromise = fetchStrategy(data);
        break;
      default:
        throw new Error('Specify a Request strategy to get directions from');
    }
  }

  return pathPromise.then(function (path) {
    return pathStrategy({
      props: { weight: weight, color: color, fillcolor: fillcolor, geodesic: geodesic, points: 'enc:' + path },
      type: { defaultProps: defaultProps }
    });
  });
};

var MapStrategy = function MapStrategy(props) {
  var rootURL = props.rootURL,
      size = props.size,
      zoom = props.zoom,
      scale = props.scale,
      style = props.style,
      center = props.center,
      format = props.format,
      client = props.client,
      region = props.region,
      visible = props.visible,
      channel = props.channel,
      maptype = props.maptype,
      language = props.language,
      signature = props.signature,
      apiKey = props.apiKey;


  var urlParts = [];

  urlParts.push(urlBuilder('size', size, '='));
  urlParts.push(urlBuilder('zoom', zoom, '='));
  urlParts.push(urlBuilder('scale', scale, '='));
  urlParts.push(urlBuilder('style', style, '='));
  urlParts.push(urlBuilder('center', center, '=')); // Todo: Allow Objects.
  urlParts.push(urlBuilder('format', format, '='));
  urlParts.push(urlBuilder('client', client, '='));
  urlParts.push(urlBuilder('region', region, '='));
  urlParts.push(urlBuilder('visible', visible, '='));
  urlParts.push(urlBuilder('channel', channel, '='));
  urlParts.push(urlBuilder('maptype', maptype, '='));
  urlParts.push(urlBuilder('language', language, '='));
  urlParts.push(urlBuilder('signature', signature, '='));
  urlParts.push(urlBuilder('key', apiKey, '='));

  var parts = urlParts.filter(function (x) {
    return x;
  }).join('&');

  return rootURL + '?' + parts;
};

var propTypes = {
  size: PropTypes.oneOf(['tiny', 'mid', 'small', 'normal']),
  color: PropTypes.string,
  iconURL: PropTypes.string,
  label: PropTypes.string,
  anchor: PropTypes.string,
  location: PropTypes.any.isRequired
};

var defaultProps = {
  size: 'normal'
};

var groupPropTypes = {
  size: PropTypes.oneOf(['tiny', 'mid', 'small', 'normal']),
  color: PropTypes.string,
  iconURL: PropTypes.string,
  label: PropTypes.string,
  anchor: PropTypes.string
};

var Marker = function Marker(props) {
  return null;
};
Marker.propTypes = propTypes;
Marker.defaultProps = defaultProps;

var MarkerGroup = function MarkerGroup(props) {
  return null;
};
MarkerGroup.propTypes = groupPropTypes;
MarkerGroup.defaultProps = defaultProps;

Marker.Group = MarkerGroup;

var propTypes$1 = {
  weight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  color: PropTypes.string,
  fillcolor: PropTypes.string,
  geodesic: PropTypes.bool,
  points: PropTypes.any.isRequired
};

var groupPropTypes$1 = {
  weight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  color: PropTypes.string,
  fillcolor: PropTypes.string,
  geodesic: PropTypes.bool
};

var defaultProps$1 = {
  weight: 5,
  geodesic: false
};

var Path = function Path(props) {
  return null;
};
Path.propTypes = propTypes$1;
Path.defaultProps = defaultProps$1;

var PathGroup = function PathGroup(props) {
  return null;
};
PathGroup.propsTypes = groupPropTypes$1;
PathGroup.defaultProps = defaultProps$1;

Path.Group = PathGroup;

var propTypes$2 = {
  baseURL: PropTypes.string,
  origin: PropTypes.string.isRequired,
  destination: PropTypes.string.isRequired,
  apiKey: PropTypes.string,
  waypoints: PropTypes.any,

  avoid: PropTypes.string,
  travelMode: PropTypes.oneOf(['driving', 'walking', 'bicycling', 'transit']),
  transitMode: PropTypes.oneOf(['bus', 'subway', 'train', 'tram', 'rail']),
  transitRoutingPreference: PropTypes.oneOf(['less_walking', 'fewer_transfers']),
  requestStrategy: PropTypes.oneOfType([PropTypes.func, PropTypes.oneOf(['fetch', 'native'])]).isRequired,

  weight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  color: PropTypes.string,
  fillcolor: PropTypes.string,
  geodesic: PropTypes.bool
};

var defaultProps$2 = {
  baseURL: 'https://maps.googleapis.com/maps/api/directions/json',
  travelMode: 'driving',
  requestStrategy: 'native',

  weight: 5,
  geodesic: false
};

var Direction = function Direction(props) {
  return null;
};

Direction.propTypes = propTypes$2;
Direction.defaultProps = defaultProps$2;

var StaticGoogleMap = function (_Component) {
  inherits(StaticGoogleMap, _Component);

  function StaticGoogleMap() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, StaticGoogleMap);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = StaticGoogleMap.__proto__ || Object.getPrototypeOf(StaticGoogleMap)).call.apply(_ref, [this].concat(args))), _this), _this.MemoizedDirectionStrategy = memoizeDirectionStrategy(directionStrategy, _extends({}, _this.props.cache)), _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(StaticGoogleMap, [{
    key: 'buildParts',
    value: function buildParts(children, props) {
      var _this2 = this;

      return React.Children.map(children, function (child) {
        if (!React.isValidElement(child)) {
          return null;
        }

        switch (child.type) {
          case Marker:
            return markerStrategy(child, props);
          case Marker.Group:
            return markerGroupStrategy(child, props);
          case Path:
            return pathStrategy(child, props);
          case Path.Group:
            return pathGroupStrategy(child, props);
          case Direction:
            if (props.cache) {
              return _this2.MemoizedDirectionStrategy(child, props);
            }
            return directionStrategy(child, props);
          default:
            var componentType = child.type;

            if (isStatelessComponent(componentType)) {
              return _this2.buildParts(renderStatelessComponent(componentType, _extends({}, child.props)), props);
            }

            if (isClassComponent(componentType)) {
              return _this2.buildParts(renderClassComponent(componentType, _extends({}, child.props)), props);
            }

            return null;
        }
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          children = _props.children,
          onGenerate = _props.onGenerate,
          Component$$1 = _props.as,
          props = objectWithoutProperties(_props, ['children', 'onGenerate', 'as']);
      var size = props.size,
          componentProps = objectWithoutProperties(props, ['rootURL', 'size', 'zoom', 'scale', 'style', 'center', 'format', 'client', 'region', 'visible', 'channel', 'maptype', 'language', 'signature', 'apiKey', 'cache', 'onCacheUpdate']);


      invariant(size, 'size property is not set');
      invariant(children, 'Component must have `Marker`, `Path` or `Direction` child');

      var childrenUrlParts = this.buildParts(children, props) || [];
      var mainUrlParts = MapStrategy(props);

      /**
       * All the parts should return a string if a component that does not return a promise isn't used
       * The Directions's component returns a promise and would instead use the Async component to render
       * This allows us render sync otherwise and partially support server side rendering.
       */
      if (!childrenUrlParts.some(function (part) {
        return (typeof part === 'undefined' ? 'undefined' : _typeof(part)) === 'object';
      })) {
        var childURL = childrenUrlParts.filter(function (part) {
          return part;
        }).join('&');
        var url = mainUrlParts + '&' + childURL;

        if (onGenerate) {
          onGenerate(url);
        }

        return React.createElement(Component$$1, _extends({}, componentProps, { src: url }));
      }

      var urlParts = Promise.all(childrenUrlParts).then(function (parts) {
        return mainUrlParts + '&' + parts.filter(function (part) {
          return part;
        }).join('&');
      });

      return React.createElement(Async, {
        promise: urlParts,
        then: function then(URL) {
          if (onGenerate) {
            onGenerate(URL);
          }

          return React.createElement(Component$$1, _extends({}, componentProps, { src: URL }));
        },
        'catch': function _catch(err) {
          return console.error(err), React.createElement(
            'span',
            null,
            'Image generation failed.'
          );
        }
      });
    }
  }]);
  return StaticGoogleMap;
}(Component);

StaticGoogleMap.defaultProps = {
  as: 'img',
  scale: 1,
  format: 'png',
  rootURL: 'https://maps.googleapis.com/maps/api/staticmap',
  apiKey: '',
  maptype: 'roadmap',
  cache: true
};

export { StaticGoogleMap, Marker, Path, Direction };
