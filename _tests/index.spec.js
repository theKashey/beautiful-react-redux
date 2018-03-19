import React from 'react';
import {ReduxFocus} from 'react-redux-focus';
import {connect, connectAndCheck, setConfig} from '../src';

import EnzymeReactAdapter from 'enzyme-adapter-react-16';
import {mount, configure as configureEnzyme} from 'enzyme';

configureEnzyme({adapter: new EnzymeReactAdapter()});


describe('Test', () => {
  it('should secure memoization', () => {
    const cb = jest.fn();
    const rb = jest.fn();
    const mapStateToProps = state => {
      cb();
      return {number: state.key}
    };

    const Component = ({number}) => {
      rb();
      return <div>{number}</div>
    };
    const ConnectedComponent = connect(mapStateToProps)(Component);

    const wrapper = mount(
      <ReduxFocus focus={(state, props) => props.state} state={{key: 'key1-value', key2: 2}}>
        <ConnectedComponent/>
      </ReduxFocus>
    );
    expect(wrapper.html()).toMatch(/key1-value/);
    expect(cb).toHaveBeenCalledTimes(1);
    expect(rb).toHaveBeenCalledTimes(1);

    wrapper.setProps({state: {key: 'key1-value', key2: 3}});

    expect(wrapper.html()).toMatch(/key1-value/);
    expect(cb).toHaveBeenCalledTimes(1);
    expect(rb).toHaveBeenCalledTimes(1);

    wrapper.setProps({state: {key: 'key2-value', key2: 3}});

    expect(wrapper.html()).toMatch(/key2-value/);
    expect(cb).toHaveBeenCalledTimes(2);
    expect(rb).toHaveBeenCalledTimes(2);

    expect(ConnectedComponent.__trackingPaths).toEqual(['key']);
  });

  it('should maintain per-instance memoization', () => {
    const cb = jest.fn();
    const mapStateToProps = state => {
      cb();
      return {number: state.key}
    };

    const Component = ({number}) => <div>{number}</div>;
    const ConnectedComponent = connect(mapStateToProps)(Component);

    const wrapper = mount(
      <ReduxFocus focus={(state, props) => props.state} state={{key1: 'key1-value', key2: 'key2-value'}}>
        <ReduxFocus focus={(state) => ({key: state.key1})}>
          <ConnectedComponent/>
        </ReduxFocus>
        <ReduxFocus focus={(state) => ({key: state.key2})}>
          <ConnectedComponent/>
        </ReduxFocus>
      </ReduxFocus>
    );
    expect(cb).toHaveBeenCalledTimes(2);

    wrapper.setProps({state: {key1: 'key1-value', key2: 'key2-value', key3: 'key3'}});
    expect(cb).toHaveBeenCalledTimes(2);

    wrapper.setProps({state: {key1: 'key1-1value', key2: 'key2-value'}});
    expect(cb).toHaveBeenCalledTimes(3);

    wrapper.setProps({state: {key1: 'key1-1value', key2: 'key2-1value'}});
    expect(cb).toHaveBeenCalledTimes(4);

    wrapper.setProps({state: {key1: 'key1-value', key2: 'key2-value'}});
    expect(cb).toHaveBeenCalledTimes(6);

    expect(ConnectedComponent.__trackingPaths).toEqual(['key']);
  });

  it('should maintain per-instance memoization', () => {
    const cb = jest.fn();
    const mapStateToProps = (state, props) => {
      cb();
      return {number: state[props.keyName], test: state.flag ? state.secret : 0}
    };

    const Component = ({number}) => <div>{number}</div>;
    const ConnectedComponent = connect(mapStateToProps)(Component);

    const wrapper = mount(
      <ReduxFocus focus={(state, props) => props.state} state={{key1: 'key1-value', key2: 'key2-value'}}>
        <ConnectedComponent keyName="key1"/>
        <ConnectedComponent keyName="key2"/>
      </ReduxFocus>
    );
    expect(cb).toHaveBeenCalledTimes(2);

    wrapper.setProps({state: {key1: 'key1-value', key2: 'key2-value', key3: 'key3'}});
    expect(cb).toHaveBeenCalledTimes(2);

    expect(ConnectedComponent.__trackingPaths).toEqual(['key1', 'flag', 'key2']);

    wrapper.setProps({state: {key1: 'key1-1value', key2: 'key2-value', flag: true}});
    expect(cb).toHaveBeenCalledTimes(4);
    expect(ConnectedComponent.__trackingPaths).toEqual(['key1', 'flag', 'key2', 'secret']);
  });

  it('should check the purity of a function', () => {

    const mapStateToProps = (state, props) => ({
      number: state[props.keyName],
      test: state.flag ? state.secret : 0,
      subObjec: {}
    });

    const Component = ({number}) => <div>{number}</div>;

    const spy = jest.spyOn(global.console, 'error')

    const ConnectedComponent = connectAndCheck(mapStateToProps)(Component);
    const wrapper = mount(
      <ReduxFocus focus={(state, props) => props.state} state={{key1: 'key1-value'}}>
        <ConnectedComponent keyName="key1"/>
      </ReduxFocus>
    );
    wrapper.setProps({state: {key1: 'key1-value', key2:2}});

    expect(spy).toHaveBeenCalledWith("shouldBePure", expect.anything(),"`s result is not equal at [subObjec], while should be equal");

    spy.mockRestore();
  });

  it('should override callback', () => {

    const mapStateToProps = (state, props) => ({
      number: state[props.keyName],
      test: state.flag ? state.secret : 0,
      subObjec: {}
    });

    const cb = jest.fn();
    const spy = jest.spyOn(global.console, 'error')
    setConfig({onNotPure: cb})

    const Component = ({number}) => <div>{number}</div>;
    const ConnectedComponent = connectAndCheck(mapStateToProps)(Component);
    const wrapper = mount(
      <ReduxFocus focus={(state, props) => props.state} state={{key1: 'key1-value'}}>
        <ConnectedComponent keyName="key1"/>
      </ReduxFocus>
    );
    wrapper.setProps({state: {key1: 'key1-value', key2:2}});


    expect(cb).toHaveBeenCalledWith("shouldBePure", expect.anything(),"`s result is not equal at [subObjec], while should be equal");
    expect(spy).not.toHaveBeenCalled();

    spy.mockRestore();
  });


});