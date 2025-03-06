import { prisma } from "./database";

async function categoriasPadrao() {

    const categorias = [
        {
            nome: 'futebol',
            icone: 'https://sports-team-match.s3.sa-east-1.amazonaws.com/categorias/icone-futebol.svg'
        },
        {
            nome: 'basquete',
            icone: 'https://sports-team-match.s3.sa-east-1.amazonaws.com/categorias/icone-basquete.svg'
        },
        {
            nome: 'tênis',
            icone: 'https://sports-team-match.s3.sa-east-1.amazonaws.com/categorias/icone-tenis.svg'
        },
        {
            nome: 'vôlei',
            icone: 'https://sports-team-match.s3.sa-east-1.amazonaws.com/categorias/icone-volei.svg'
        },
        {
            nome: 'tênis de mesa',
            icone: 'https://sports-team-match.s3.sa-east-1.amazonaws.com/categorias/icone-tenis-mesa.svg'
        },
        {
            nome: 'futsal',
            icone: 'https://sports-team-match.s3.sa-east-1.amazonaws.com/categorias/icone-futsal.svg'
        },
        {
            nome: 'handebol',
            icone: 'https://sports-team-match.s3.sa-east-1.amazonaws.com/categorias/icone-handebol.svg'
        },
        {
            nome: 'natação',
            icone: 'https://sports-team-match.s3.sa-east-1.amazonaws.com/categorias/icone-natacao.svg'
        }
    ];

    for (let index = 0; index < categorias.length; index++) {

        const categoria = categorias[index];

        // verifica se encontrou o nome da categoria, caso encontrou não faz nada, se não encontrou adiciona no banco
        await prisma.categoria.upsert({
            where: { 
                nome: categoria.nome 
            },
            update: {},
            create: {
                nome: categoria.nome,
                icone: categoria.icone
            }
        })
        
    }

}

categoriasPadrao();