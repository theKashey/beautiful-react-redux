import React from 'react';
import {connect as realConnect} from 'react-redux';
import {connect as patchConnect} from '../src/index';
import "../src/patch";

import {storiesOf} from '@storybook/react';

alert(realConnect === patchConnect ? 'patched' : 'FAIL');

storiesOf('Button', module)
  .add('with some emoji', () => <div>no place for errors</div>);
