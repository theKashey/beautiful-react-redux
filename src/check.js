import * as reduxES from 'react-redux';
import {connectAndCheck, setConfig} from './index';

let patched = false;

try {
  require('react-redux/es/connect/connect').default = connectAndCheck;
  patched = true;
} catch (e) {

}

if (!patched) {
  try {
    reduxES.connect = connectAndCheck;
    patched = true;
  } catch (e) {

  }
}

if (!patched) {
  console.error('beautiful-react-redux: could not patch redux, please use {connect} from "beautiful-react-redux" instead of "react-redux"');
}

const configure = options => setConfig(options);

export default configure;