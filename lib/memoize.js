'use strict';

var _reactRedux = require('react-redux');

var redux = _interopRequireWildcard(_reactRedux);

var _memoizeState = require('memoize-state');

var _memoizeState2 = _interopRequireDefault(_memoizeState);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var c = redux.connect;
redux.connect = function (mapStateToProps, mapDispatchToProps, mergeProps, options) {

  if (options && 'pure' in options && options.pure) {
    return c.call(redux, mapStateToProps, mapDispatchToProps, mergeProps, options);
  }

  return c.call(redux, mapStateToProps && (0, _memoizeState2.default)(mapStateToProps, { safe: true }), mapDispatchToProps, mergeProps, options);
};