import * as redux from 'react-redux';
import {shouldBePure} from 'memoize-state';

const c = redux.connect;
redux.connect = (a, ...rest) => c.call(redux, a ? shouldBePure(a) : a, ...rest);