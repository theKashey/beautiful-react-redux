beautiful-react-redux
=====
Automagically enhances, even enchants redux `connect`, to be more concrete - `mapStateToProps`,
wrapping it with `memoize-state` to sky-rocket your application.

Just import beautiful-react-redux and forget about __reselect__ and any other selector memoization.
Now your application will runs like it has MobX underneath.

No updates when you dont expect them. For all. For free!

[![NPM](https://nodei.co/npm/beautiful-react-redux.png?downloads=true&stars=true)](https://nodei.co/npm/beautiful-react-redux/)

## Usage

#### Auto-magic
```js
// to get automatic deep-equal memoization for all mapStateToProps
import 'beautiful-react-redux/patch';
```

#### Or just replace react-redux by beautiful-react-redux
```js
//import {connect, Provider} from 'react-redux';
import {connect, Provider} from 'beautiful-react-redux';
```

100% compatible with any other memoization you might already had underneath.

#### Doubke check your existing selectors
If you already handling selectors by your own, and dont need external tools - 
you can just double check that your mapStateToProps is good enough.
```js
// to get automatic checks for your mapStateToProps
import 'beautiful-react-redux/check';
```

PS: Better not to mix memoize and check.

# IE11 and React-native users!
This library uses ES6 Proxy and Reflection underneath. In order to run it you
have to include polyfill - https://github.com/tvcutsem/harmony-reflect

```js
npm install harmony-reflect
```

Consider double measure performance, or use only `beautiful-react-redux/check` and another memoization library.

# Licence
MIT