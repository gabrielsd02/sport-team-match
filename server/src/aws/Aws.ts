import { 
    S3Client, 
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand
} from "@aws-sdk/client-s3";
import { Buffer } from 'buffer';
import { randomUUID } from "crypto";

export default {

    conectar() { 
        const s3Client = new S3Client({
            region: 'sa-east-1',
            credentials: {
                accessKeyId: process.env.ACCESS_KEY_ID as string,
                secretAccessKey: process.env.SECRET_ACCESS_KEY as string
            }
        });
        return s3Client;
    },
    async adicionar(arquivo: string) {

        const s3Client = this.conectar();
        const BUCKET = process.env.BUCKET as string;

        const buffer = Buffer.from(arquivo.replace(/^data:image\/\w+;base64,/, ""),'base64');
        
        // obtendo o tipo do arquivo: jpeg, png or gif
        const type = arquivo.split(';')[0].split('/')[1];

        const nomeArquivo = randomUUID()+`.${type}`;
        
        try {
            await s3Client.send(
                new PutObjectCommand({
                    Body: buffer,
                    Bucket: BUCKET,
                    Key: nomeArquivo,  
                    ContentEncoding: 'base64', 
                    ContentType: `image/${type}`
                })
            );
            return process.env.LINK_AWS+nomeArquivo;
        } catch (err) {
            throw err;
        }
    },
    async remover(arquivo: string) {

        const s3Client = this.conectar();
        const BUCKET = process.env.BUCKET as string;
        
        try {
            await s3Client.send(
                new DeleteObjectCommand({
                    Bucket: BUCKET,
                    Key: arquivo
                })
            );
        } catch (err) {
            throw err;
        }

    },
    async consultarObjeto(chave: string) {

        const s3Client = this.conectar();
        const BUCKET = process.env.BUCKET as string;

        try {
            const data = await s3Client.send(
                new GetObjectCommand({ 
                    Bucket: BUCKET,
                    Key: chave
                })
            );
            return data;
        } catch (err) {
            throw err;
        }
        
    }

};