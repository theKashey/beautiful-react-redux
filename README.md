beautiful-react-redux
=====
Automagically enhances, even enchants redux `connect`, to be more concrete - `mapStateToProps`,
wrapping it with `memoize-state` to sky-rocket your application.

Just import beautiful-react-redux and forget about __reselect__ and any other selector memoization.
Now your application will runs like it has MobX underneath.

No updates when you dont expect them. For all. For free!

[![NPM](https://nodei.co/npm/beautiful-react-redux.png?downloads=true&stars=true)](https://nodei.co/npm/beautiful-react-redux/)

## Usage
```js
// to get automatic deep-equal memoization for all mapStateToProps
import 'beautiful-react-redux/memoize';
```

If you already handling selectors by your own, and dont need external tools - 
you can just double check that your mapStateToProps are good enought.
```js
// to get automatic checks for your mapStateToProps
import 'beautiful-react-redux/check';
```

PS: Better not to mix them - check also has memoization underneath.

PPS: This is literally 3 lines of code.

# Licence
MIT