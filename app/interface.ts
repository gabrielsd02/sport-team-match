export interface ErroRequisicao {
    response?: {
        data: {
            message: string;
            error: boolean;
        }
        status: number;
    }
}