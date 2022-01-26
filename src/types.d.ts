import * as http from 'http';

interface decoded {
  id?: string;
}

// module augmentation
declare module 'express-serve-static-core' {
  export interface Request extends http.IncomingMessage, Express.Request {
    decoded: decoded;
  }
}
