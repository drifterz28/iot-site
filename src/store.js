import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from './reducers';

const middleware = [thunkMiddleware];

const composeEnhancers =
  (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

const enhancer = composeEnhancers(applyMiddleware(...middleware));

export default function configureStore(initialState) {
  return createStore(rootReducer, initialState, enhancer);
}
