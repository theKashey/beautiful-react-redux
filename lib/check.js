'use strict';

var _reactRedux = require('react-redux');

var redux = _interopRequireWildcard(_reactRedux);

var _index = require('./index');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

redux.connect = _index.connectAndCheck;