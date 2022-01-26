import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import User from '@src/models/User';
import OperatorRepository from '@src/repository/OperatorRepository';
import TelepresencaRepository from '@src/repository/TelepresencaRepository';

interface TokenPayLoad {
  id: string;
  iat: number;
  exp: number;
}

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const token = req.headers?.['x-access-token'];
  if (!token) {
    res.status(401).send({
      msg: 'Restricted access',
      code: 401,
      error: 'Unauthorized',
    });
    return;
  }
  try {
    // res.status(200).send(token);
    const decoded = (await jwt.verify(
      token as string,
      process.env.TOKEN || 'ola'
    )) as TokenPayLoad;
    req.decoded = { id: decoded.id };
    next();
  } catch (err) {
    res.status(401).send({
      msg: 'Restricted access',
      code: 401,
      error: 'Unauthorized',
    });
  }
}

export async function isMaster(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { id } = req.decoded;
  if (!id) {
    res.status(401).send({
      msg: 'Restricted access',
      code: 401,
      error: 'Unauthorized',
    });
    return;
  }
  try {
    const repository = getRepository(User);
    const user = await repository.findOne({ where: { id } });
    // se não achar o usuário retorna Unauthorized
    if (!user) {
      res.status(401).send({
        msg: 'Restricted access',
        code: 401,
        error: 'Unauthorized',
      });
      return;
    }
    if (user.type !== 'master') {
      res.status(401).send({
        msg: 'Restricted function',
        code: 401,
        error: 'Unauthorized',
      });
      return;
    }

    next();
  } catch (err) {
    res.status(401).send({
      msg: 'Restricted access',
      code: 401,
      error: 'Unauthorized',
    });
  }
}

export async function isOperator(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.decoded;
    if (!id) {
      res.status(401).send({
        msg: 'Restricted access',
        code: 401,
        error: 'Unauthorized',
      });
      return;
    }
    const operator = await OperatorRepository.getByID(id);
    if (!operator) {
      res.status(401).send({
        msg: 'Restricted access',
        code: 401,
        error: 'Unauthorized',
      });
      return;
    }
    next();
  } catch (err) {
    res.status(401).send({
      msg: 'Restricted access',
      code: 401,
      error: 'Unauthorized',
    });
  }
}

export async function isTelepresenca(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.decoded;
    if (!id) {
      res.status(401).send({
        msg: 'Restricted access',
        code: 401,
        error: 'Unauthorized',
      });
      return;
    }
    const telepresenca = await TelepresencaRepository.getById(id);
    if (!telepresenca) {
      res.status(401).send({
        msg: 'Restricted access',
        code: 401,
        error: 'Unauthorized',
      });
      return;
    }
    next();
  } catch (err) {
    res.status(401).send({
      msg: 'Restricted access',
      code: 401,
      error: 'Unauthorized',
    });
  }
}
