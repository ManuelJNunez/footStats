import { Injectable, NestMiddleware, Logger } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggerMiddleware.name);

  use(req: any, res: any, next: () => void) {
    next();

    this.logger.log(
      `Method: '${req.method}' PATH: '${req.url}' STATUS: '${res.statusCode}'`,
    );
  }
}
