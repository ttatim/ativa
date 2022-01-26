import { Controller, Get, Middleware, Post } from '@overnightjs/core';
import { Request, Response } from 'express';
import * as AuthService from '@src/middlewares/services/AuthenticateService';
import TelepresencaRepository from '@src/repository/TelepresencaRepository';

@Controller('view')
export class ScreenController {
  @Get('operator/screen')
  public async operator(req: Request, res: Response): Promise<void> {
    try {
      res.render('operador');
    } catch (err) {
      console.log(err);
      res.status(500).send({
        msg: 'Falha internar',
        code: 500,
        error: 'Internal Server Error',
      });
    }
  }
  @Get('operator')
  public async operatorSignin(req: Request, res: Response): Promise<void> {
    try {
      res.render('login-operador');
    } catch (err) {
      console.log(err);
      res.status(500).send({
        msg: 'Falha internar',
        code: 500,
        error: 'Internal Server Error',
      });
    }
  }

  @Get('telepresenca')
  // @Middleware(AuthService.authenticate)
  public async telepresenca(req: Request, res: Response): Promise<void> {
    try {
      res.render('login-telepresenca');
    } catch (err) {
      console.log(err);
      res.status(500).send({
        msg: 'Falha internar',
        code: 500,
        error: 'Internal Server Error',
      });
    }
  }
  @Get('telepresenca/screen')
  public async telepresencaScreen(req: Request, res: Response): Promise<void> {
    try {
      const { s } = req.query;
      if (!s || Array.isArray(s)) {
        res.redirect('/view/telepresenca');
        return;
      }
      const id = s as string;
      const telepresenca = await TelepresencaRepository.getById(id);
      if (!telepresenca) {
        res.redirect('/view/telepresenca');
        return;
      }

      res.render('telepresenca', { name: telepresenca.name });
    } catch (err) {
      console.log(err);
      res.status(500).send({
        msg: 'Falha internar',
        code: 500,
        error: 'Internal Server Error',
      });
    }
  }
}
