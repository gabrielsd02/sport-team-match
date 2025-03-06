import { 
    NextFunction, 
    Request, 
    Response 
} from 'express';
import jwt from 'jsonwebtoken';

// Middleware para verificar o token
export function verificarToken(
  req: Request, 
  res: Response, 
  next: NextFunction
) {

  // resgata token completo
  const tokenBearer = req.header('Authorization');

  // resgata somente o jwt
  const token = tokenBearer?.split('Bearer')[1].replace(/\s+/g, '');
  
  // se não tiver token
  if (!token) return res.status(401).json({ message: 'Token não fornecido' });

  try {

    // descriptografa
    const decoded = jwt
      .verify(token, process.env.CHAVE_JWT as string)
    ; 
    
    // se houve algum erro na hora da descriptografia
    if(!decoded) throw new Error();

    // Avança para a próxima rota/middleware
    next();

  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }

}