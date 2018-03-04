'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Provider = exports.connect = undefined;

var _react = require('react');

var _reactRedux = require('react-redux');

var _memoizeState = require('memoize-state');

var _memoizeState2 = _interopRequireDefault(_memoizeState);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var connect = function connect(mapStateToProps, mapDispatchToProps, mergeProps, options) {

  if (options && 'pure' in options && !options.pure) {
    return (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps, mergeProps, options);
  }

  var memoizedMapStateToProps = mapStateToProps && (0, _memoizeState2.default)(mapStateToProps, { strictArguments: true });

  return function (WrappedComponent) {

    var localMapStateToProps = memoizedMapStateToProps && mapStateToProps && (0, _memoizeState2.default)(memoizedMapStateToProps, { strictArguments: true });

    // TODO: create `areStatesEqual` based on memoize-state usage.
    return (0, _reactRedux.connect)(localMapStateToProps, mapDispatchToProps, mergeProps, options)(WrappedComponent);
  };
};

exports.connect = connect;
exports.Provider = _reactRedux.Provider;