import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';

import localizacaoReducer from './reducerLocalizacao';
import usuarioReducer from './reducerUsuario';

// combina os reducers das duas stores em um único reducer
const rootReducer = combineReducers({
    localizacao: localizacaoReducer,
    usuario: usuarioReducer,
});
  
// cria o store combinado
const store = configureStore({
    reducer: rootReducer,
});

export default store;