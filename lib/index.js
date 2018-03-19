'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setConfig = exports.connectAndCheck = exports.Provider = exports.connect = undefined;

var _reactRedux = require('react-redux');

var redux = _interopRequireWildcard(_reactRedux);

var _memoizeState = require('memoize-state');

var _memoizeState2 = _interopRequireDefault(_memoizeState);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var config = {
  onNotPure: function onNotPure() {
    var _console;

    return (_console = console).error.apply(_console, arguments);
  }
};

var realReactReduxConnect = _reactRedux.connect;

var connect = function connect(mapStateToProps, mapDispatchToProps, mergeProps) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};


  if (options && 'pure' in options && !options.pure) {
    return realReactReduxConnect(mapStateToProps, mapDispatchToProps, mergeProps, options);
  }

  return function (WrappedComponent) {

    var lastAffectedPaths = null;
    var affectedMap = {};

    var localMapStateToProps = mapStateToProps && (0, _memoizeState2.default)(mapStateToProps, { strictArity: true });

    function mapStateToPropsFabric() {
      function finalMapStateToProps(state, props) {
        var result = localMapStateToProps(state, props);

        if (!localMapStateToProps.cacheStatistics.lastCallWasMemoized) {
          // get state related paths
          var affected = localMapStateToProps.getAffectedPaths()[0];
          affected.forEach(function (key) {
            return affectedMap[key.split('.')[1]] = true;
          });
          lastAffectedPaths = Object.keys(affectedMap);
        }
        return result;
      }

      if (localMapStateToProps) {
        Object.defineProperty(finalMapStateToProps, 'length', {
          writable: false,
          configurable: true,
          value: localMapStateToProps.length
        });

        Object.defineProperty(finalMapStateToProps, 'cacheStatistics', {
          get: function get() {
            return localMapStateToProps.cacheStatistics;
          },
          configurable: true,
          enumerable: false
        });

        Object.defineProperty(finalMapStateToProps, 'trackedKeys', {
          get: function get() {
            return lastAffectedPaths;
          },
          configurable: true,
          enumerable: false
        });
      }

      return finalMapStateToProps;
    }

    function areStatesEqual(state1, state2) {
      if (!lastAffectedPaths) {
        return state1 === state2;
      }
      return lastAffectedPaths.reduce(function (acc, key) {
        return acc && state1[key] === state2[key];
      }, true);
    }

    // TODO: create `areStatesEqual` based on memoize-state usage.
    var ImprovedComponent = realReactReduxConnect(localMapStateToProps && mapStateToPropsFabric, mapDispatchToProps, mergeProps, Object.assign({ areStatesEqual: areStatesEqual }, options))(WrappedComponent);

    Object.defineProperty(ImprovedComponent, '__trackingPaths', {
      get: function get() {
        return lastAffectedPaths;
      },
      configurable: true,
      enumerable: false
    });

    return ImprovedComponent;
  };
};

var onNotPure = function onNotPure() {
  var _config;

  return (_config = config).onNotPure.apply(_config, arguments);
};
var connectAndCheck = function connectAndCheck(a) {
  for (var _len = arguments.length, rest = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    rest[_key - 1] = arguments[_key];
  }

  return realReactReduxConnect.apply(undefined, [a ? (0, _memoizeState.shouldBePure)(a, { onTrigger: onNotPure }) : a].concat(rest));
};

var setConfig = function setConfig(options) {
  config = Object.assign(config, options);
};

exports.connect = connect;
exports.Provider = _reactRedux.Provider;
exports.connectAndCheck = connectAndCheck;
exports.setConfig = setConfig;