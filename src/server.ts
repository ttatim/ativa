import './util/module-alias';
import 'reflect-metadata';
import express, { Request, Response, Application, NextFunction } from 'express';
import { ListOfAttendanceRoomMemberController } from '@src/controllers/ListOfAttendanceRoomMemberController';
import { TelepresencaController } from '@src/controllers/TelepresencaController';
import { AttendanceRoom } from '@src/controllers/AttendanceRoomController';
import { OperatorController } from '@src/controllers/OperatorController';
import { ScreenController } from '@src/controllers/ScreenController';
import { UserController } from '@src/controllers/UserController';
import SocketService from './SocketService';
import { Server } from '@overnightjs/core';
import * as database from '@src/database';
import * as https from 'https';
import * as http from 'http';
import helmet from 'helmet';
import path from 'path';
import fs from 'fs';

export class SetupServer extends Server {
  private server!: http.Server;
  // private server!: https.Server;

  constructor(private port = 3000) {
    super();
  }

  public async init(): Promise<void> {
    this.setExpress();
    // this.requestHttps();
    this.setController();
    this.setPage404();
    await this.setDatabase();
    console.log('📦 Connect database');
  }

  private setExpress(): void {
    this.app.use(helmet());
    this.app.use(express.json());
    this.app.set('view engine', 'ejs');
    this.app.set('views', path.join(__dirname, 'views'));
    this.app.use(express.static(path.join(__dirname, 'public')));

    this.app.use(function (req, res, next) {
      res.setHeader(
        'Content-Security-Policy',
        `connect-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com;`
      );
      next();
    });
  }

  private async setDatabase(): Promise<void> {
    await database.connect();
  }

  public async close(): Promise<void> {
    await database.close();
  }

  private setPage404(): void {
    this.app.use((req: Request, res: Response) => {
      res.status(404).send({
        msg: 'Humm, este página não existe',
      });
    });
  }

  private setController(): void {
    const operatorController = new OperatorController();
    const telepresencaController = new TelepresencaController();
    const screenController = new ScreenController();
    const userController = new UserController();
    const attendanceRoom = new AttendanceRoom();
    const listOfAttendanceRoomMembersControllers = new ListOfAttendanceRoomMemberController();

    this.addControllers([
      operatorController,
      telepresencaController,
      screenController,
      userController,
      attendanceRoom,
      listOfAttendanceRoomMembersControllers,
    ]);
  }

  public start(): void {
    this.server = http.createServer(this.app);
    this.initSocket();
    this.server.listen(this.port, () => {
      console.log('🔥 Server listening on port: ' + this.port);
    });
  }

  private requestHttps() {
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      if (
        !req.secure &&
        req.get('x-forwarded-proto') !== 'https' &&
        process.env.NODE_ENV !== 'dev'
      ) {
        res.redirect('https://' + req.get('host') + req.url);
      } else next();
    });
  }

  public initSocket(): void {
    SocketService(this.server);
  }

  public getApp(): Application {
    return this.app;
  }
}
