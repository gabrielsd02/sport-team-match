import { prisma } from "../database";

export default {
    async consultar() {
        const categorias = await prisma.categoria.findMany();
        return categorias;
    },
    async consultarId(idCategoria: string) {
        const id = Number(idCategoria);
        const categoria = await prisma.categoria.findUnique({ where: { id } });
        return categoria;
    }
}