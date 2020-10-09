import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import "../node_modules/font-awesome/css/font-awesome.min.css";
import "./App.css";

ReactDOM.render(
	<App />,
	document.getElementById('root')
);

serviceWorker.unregister();
