import {Component} from 'react';
import {connect as reactReduxConnect, Provider} from 'react-redux';
import memoize from 'memoize-state';

const realReactReduxConnect = reactReduxConnect;
const connect = (mapStateToProps,
                 mapDispatchToProps,
                 mergeProps,
                 options) => {

  if (options && ('pure' in options) && !options.pure) {
    return realReactReduxConnect(
      mapStateToProps,
      mapDispatchToProps,
      mergeProps,
      options
    )
  }

  const memoizedMapStateToProps = mapStateToProps && memoize(mapStateToProps, {strictArguments: true});

  return WrappedComponent => {

    const localMapStateToProps = memoizedMapStateToProps && mapStateToProps && memoize(memoizedMapStateToProps, {strictArguments: true});

    // TODO: create `areStatesEqual` based on memoize-state usage.
    return realReactReduxConnect(
      localMapStateToProps,
      mapDispatchToProps,
      mergeProps,
      options
    )(WrappedComponent);
  }
};

export {
  connect,
  Provider
}