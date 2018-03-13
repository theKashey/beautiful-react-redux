import {connect as reactReduxConnect, Provider} from 'react-redux';
import memoize, {shouldBePure} from 'memoize-state';
import * as redux from "react-redux";

const realReactReduxConnect = reactReduxConnect;
const connect = (mapStateToProps,
                 mapDispatchToProps,
                 mergeProps,
                 options = {}) => {

  if (options && ('pure' in options) && !options.pure) {
    return realReactReduxConnect(
      mapStateToProps,
      mapDispatchToProps,
      mergeProps,
      options
    )
  }

  return WrappedComponent => {

    let lastAffectedPaths = null;
    const affectedMap = {};

    const localMapStateToProps = mapStateToProps && memoize(mapStateToProps, {strictArity: true})

    function mapStateToPropsFabric () {
      function finalMapStateToProps(state, props) {
        const result = localMapStateToProps(state, props);

        if (!localMapStateToProps.cacheStatistics.lastCallWasMemoized) {
          // get state related paths
          const affected = localMapStateToProps.getAffectedPaths()[0];
          affected.forEach(key => (affectedMap[key.split('.')[1]] = true));
          lastAffectedPaths = Object.keys(affectedMap);
        }
        return result;
      }

      if (localMapStateToProps) {
        Object.defineProperty(finalMapStateToProps, 'length', {
          writable: false,
          configurable: true,
          value: localMapStateToProps.length,
        });

        Object.defineProperty(finalMapStateToProps, 'cacheStatistics', {
          get: () => localMapStateToProps.cacheStatistics,
          configurable: true,
          enumerable: false,
        });

        Object.defineProperty(finalMapStateToProps, 'trackedKeys', {
          get: () => lastAffectedPaths,
          configurable: true,
          enumerable: false,
        });
      }

      return finalMapStateToProps;
    }

    function areStatesEqual(state1, state2) {
      if (!lastAffectedPaths) {
        return state1 === state2;
      }
      return lastAffectedPaths.reduce((acc, key) => acc && state1[key] === state2[key], true);
    }

    // TODO: create `areStatesEqual` based on memoize-state usage.
    const ImprovedComponent  = realReactReduxConnect(
      localMapStateToProps && mapStateToPropsFabric,
      mapDispatchToProps,
      mergeProps,
      Object.assign({areStatesEqual}, options)
    )(WrappedComponent);

    Object.defineProperty(ImprovedComponent, '__trackingPaths', {
      get: () => lastAffectedPaths,
      configurable: true,
      enumerable: false,
    });

    return ImprovedComponent;
  }
};

const connectAndCheck = (a, ...rest) => realReactReduxConnect(a ? shouldBePure(a) : a, ...rest);

export {
  connect,
  Provider,

  connectAndCheck
}