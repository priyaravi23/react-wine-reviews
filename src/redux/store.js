import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import { wineReviews } from "./reducers";

// Create the store by passing in the reducer function
// create a logger middleware
const logger = createLogger({});
// apply the thunk and logger middlewares
const middlewareConfig = applyMiddleware(thunk, logger);
// Allow other middlewares to step into the redux workflow
const store = createStore(wineReviews, middlewareConfig);
window.store = store;

export default store;