import { 
  createSlice, 
  createSelector 
} from '@reduxjs/toolkit';

import { ILocalizacao } from '../src/interfaces/ILocalizacao';

const localizacao = createSlice({
  name: 'localizacao',
  initialState: null,
  reducers: {
    setLocalizacao(state, action) {
        return Object.assign(state ?? {}, action.payload);
    }
  }
});

const localizacaoState = (state: { localizacao: ILocalizacao }) => state.localizacao;

export const getLocalizacao = createSelector(
  [localizacaoState],
  (localizacao) => localizacao
);

export const { setLocalizacao } = localizacao.actions;

export default localizacao.reducer;