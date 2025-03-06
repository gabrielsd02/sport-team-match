export type IRotas = {
    Login: undefined;
    Home: undefined;
    Cadastro: undefined;
    RecuperacaoSenha: undefined;
    Convites: undefined;
    ListaParticipantesEvento: {
      idEvento?: number;
    } | undefined;
    ListaUsuarios: {
      idEvento?: number;      
    } | undefined;
    ListaEventos: {
      eventosUsuario?: boolean;
      totalParticipantes?: number;
      mostrarFiltros?: boolean;
    } | undefined;
    Evento: {
      id: number;
      contagemParticipante?: string;
      aceitarConvite?: () => void;
    } | undefined;
    Perfil: {
      mostrarModalSair?: boolean;
    },
    MapaEventos: undefined;
};