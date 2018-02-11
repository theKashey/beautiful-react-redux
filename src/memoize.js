import * as redux from 'react-redux';
import memoize from 'memoize-state';

const c = redux.connect;
redux.connect = (a, ...rest) => c.call(redux, a ? memoize(a) : a, ...rest);