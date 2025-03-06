import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import Rotas from './routes';
import rateLimit from 'express-rate-limit';

const env = process.env.NODE_ENV || "development";

dotenv.config({
    path: `.env.${env}`
});

process.env.TZ = 'America/Sao_Paulo';

const app = express();
const PORT = process.env.PORTA!;
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    limit: 100, // limita cada IP para 100 requisições por windowMs
    message: "Foram identificadas muitas requisições para esse IP, por favor tente novamente mais tarde"
});

app.use(express.json());
app.use(cors());

const rotas = new Rotas();

app.use('/api', limiter);
app.use('/api', rotas.router);

app.listen(
    parseInt(PORT), 
    '0.0.0.0', 
    () => console.log("Servidor rodando na porta: ", PORT)
);