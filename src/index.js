import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux'
import reduxThunk from 'redux-thunk'
import rootReducer from './redux/rootReducer'

const composeEnhancers =
    typeof window === 'object' &&
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__( {
        } ) : compose;

const loggerMiddleware = store => next => action => {
    const result = next( action )
    return result
}

const store = createStore( rootReducer, composeEnhancers(
    applyMiddleware(
        loggerMiddleware,
        reduxThunk
    )
) )

const app = (
    <Provider store={ store }>
        <App />
    </Provider>
)

ReactDOM.render( app, document.getElementById( 'root' ) )

serviceWorker.unregister();
