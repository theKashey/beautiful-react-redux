import * as redux from 'react-redux';
import memoize from 'memoize-state';

const c = redux.connect;
redux.connect = (mapStateToProps,
                 mapDispatchToProps,
                 mergeProps,
                 options) => {

  if (options && ('pure' in options) && options.pure) {
    return c.call(redux, mapStateToProps,
      mapDispatchToProps,
      mergeProps,
      options)
  }

  return c.call(redux,
    mapStateToProps && memoize(mapStateToProps, {strictArguments: true}),
    mapDispatchToProps,
    mergeProps,
    options
  );
};