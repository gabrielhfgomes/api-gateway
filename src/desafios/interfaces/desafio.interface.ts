import { Document } from 'mongoose';
import { Jogador } from 'src/jogadores/interfaces/jogador.interface';
import { DesafioStatus } from '../desafio-status.enum';

export interface Desafio extends Document {
    dataHoraDesafio: Date;
    status: DesafioStatus;
    dataHoraSolicitacao: Date;
    dataHoraResposta: Date;
    solicitante: Jogador;
    categoria: string;
    partida?: string;
    jogadores: Array<Jogador>;
}

export interface Partida extends Document {
    categoria?: string;
    desafio?: string;
    jogadores?: Array<Jogador>;
    def?: Jogador;
    resultado?: Array<Resultado>;
}

export interface Resultado {
    set: string;
}