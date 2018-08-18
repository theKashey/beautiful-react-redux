import {connect as reactReduxConnect, Provider} from 'react-redux';
import memoize, {shouldBePure} from 'memoize-state';
import functionDouble from 'function-double';

let config = {
  onNotPure: (name, ...args) => {
    console.group(`why-did-you-update-redux: ${name}`)
    console.log('mapStateToProps:', args[1]);
    console.log('functions'+args[2]);
    console.groupEnd();
  }
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
    let isFabric = 0;
    const affectedMap = {};

    function mapStateToPropsFabric() {
      let localMapStateToProps;
      let firstCall = true;
      let result;

      function finalMapStateToProps(state, props) {
        if (firstCall) {
          const defaultMapStateToProps = memoize(mapStateToProps, {strictArity: true});

          if (isFabric === 0) {
            result = defaultMapStateToProps(state, props);
            if (typeof result === 'function') {
              isFabric = 1;
              functionDouble(finalMapStateToProps, result);
            } else {
              isFabric = -1;
            }
          }

          if (isFabric === 1) {
            localMapStateToProps = memoize(defaultMapStateToProps(state, props), {strictArity: true});
          } else {
            localMapStateToProps = defaultMapStateToProps;
          }
        }

        result = localMapStateToProps(state, props);

        if (firstCall || !localMapStateToProps.cacheStatistics.lastCallWasMemoized) {
          // get state related paths
          const affected = localMapStateToProps.getAffectedPaths()[0];
          affected.forEach(key => (affectedMap[key.split('.')[1]] = true));
          lastAffectedPaths = Object.keys(affectedMap);
        }

        firstCall = false;

        return result;
      }

      functionDouble(finalMapStateToProps, mapStateToProps);

      Object.defineProperty(finalMapStateToProps, 'trackedKeys', {
        get: () => lastAffectedPaths,
        configurable: true,
        enumerable: false,
      });


      return finalMapStateToProps;
    }

    function areStatesEqual(state1, state2) {
      if (!lastAffectedPaths) {
        return state1 === state2;
      }
      return lastAffectedPaths.reduce((acc, key) => acc && state1[key] === state2[key], true);
    }

    const ImprovedComponent = realReactReduxConnect(
      mapStateToProps && mapStateToPropsFabric,
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
const connectAndCheck = (a, ...rest) => (
  (WrappedComponent) => {
    const Component = realReactReduxConnect(
      a
        ? shouldBePure(a, {
          onTrigger: (...args) => onNotPure(Component.displayName || Component.name, ...args),
          checkAffectedKeys: false,
        })
        : a
      , ...rest
    )(WrappedComponent);
    return Component;
  }
);

const setConfig = options => {
  config = Object.assign(config, options);
};

export {
  connect,
  Provider,

  connectAndCheck,
  setConfig
};