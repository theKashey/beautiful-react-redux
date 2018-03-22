import {connect as reactReduxConnect, Provider} from 'react-redux';
import memoize, {shouldBePure} from 'memoize-state';
import functionDouble from 'function-double';

let config = {
  onNotPure: (...args) => console.error(...args)
};

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

    function mapStateToPropsFabric() {
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
        functionDouble(finalMapStateToProps, localMapStateToProps);

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

    const ImprovedComponent = realReactReduxConnect(
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


const onNotPure = (...args) => config.onNotPure(...args);
const connectAndCheck = (a, ...rest) => realReactReduxConnect(a ? shouldBePure(a, {onTrigger: onNotPure}) : a, ...rest);

const setConfig = options => {
  config = Object.assign(config,options);
};

export {
  connect,
  Provider,

  connectAndCheck,
  setConfig
};