import { ParticipantesEventoResponse } from "../interfaceListaParticipantes";

export interface IItemParticipanteProps {
    criador: boolean;
    idUsuarioCriador: number;
    participante: ParticipantesEventoResponse['participantes'][0];
    cliqueParticipante: () => void;
    deletarParticipante: (id: number) => void;
}