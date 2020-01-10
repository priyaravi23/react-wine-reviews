import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import rootReducer from "./reducers";

// Create the store by passing in the reducer function
// create a logger middleware
const logger = createLogger({});
// apply the thunk and logger middlewares
const middlewareConfig = applyMiddleware(thunk, logger);
// Allow other middlewares to step into the redux workflow
const store = createStore(rootReducer, middlewareConfig);
window.store = store;

export default store;
