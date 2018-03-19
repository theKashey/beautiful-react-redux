import * as redux from 'react-redux';
import {connectAndCheck, setConfig} from './index';

redux.connect = connectAndCheck;

const configure = options => setConfig(options);

export default configure;