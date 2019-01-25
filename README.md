# Kalend

If an error occurs while trying to sign in with Google, run the PowerShell script called *setup.ps1* by right-clicking and selecting **Run with PowerShell**

To have the app running

1. Clone the repo

```
cd into repo
npm install
```

```
cd into server folder
run npm install
```

To start server:
inside server folder run node server.js

If Jest testing isn't working, do these steps:
1. npm i -D babel-core@bridge

2. Change .babelrc to babel.config.js

3. Overwrite the babel.config.js content with this:

	module.exports = function (api) {
  	    api.cache(true)
  	    return {
    	        "presets": ["module:metro-react-native-babel-preset"]
  	    };
	}
