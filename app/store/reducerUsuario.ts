import axios from 'axios';
import { 
  createSlice, 
  createSelector 
} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { IUsuario } from '../src/interfaces/IUsuario';

const usuario = createSlice({
  name: 'usuario',
  initialState: {
    id: null,
    nome: '',
    token: '',
    foto: ''
  },
  reducers: {
    setUsuario(state, action) {
        const { nome, token, foto, id } = action.payload;
        return {
          ...state,
          id,
          nome, 
          token,
          foto
        }
    },
    logoutUsuario(state) {
        state.nome = '';
        state.token = '';
        state.foto = '';
        AsyncStorage.removeItem("@sport-team-match:usuario");
        axios.defaults.headers.common['Authorization'] = null;
    }
  }
});

const usuarioState = (state: { usuario: IUsuario }) => state.usuario;

export const getNomeUsuario = createSelector(
  [usuarioState],
  (usersState) => usersState.nome
);

export const getFotoUsuario = createSelector(
  [usuarioState],
  (usersState) => usersState.foto
);

export const getTokenUsuario = createSelector(
  [usuarioState],
  (usersState) => usersState.token
);

export const getIdUsuario = createSelector(
  [usuarioState],
  (usersState) => usersState.id
);

export const { setUsuario, logoutUsuario } = usuario.actions;

export default usuario.reducer;