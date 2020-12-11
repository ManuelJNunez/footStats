import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggerInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const before = Date.now();

    return next.handle().pipe(
      tap(() => {
        const after = Date.now();
        const res = context.switchToHttp().getResponse();

        this.logger.log(
          `METHOD: '${req.method}' PATH: '${req.url}' STATUS: '${
            res.statusCode
          }' TIME: ${after - before}ms`,
        );
      }),
      catchError(async (err) => {
        const after = Date.now();
        const res = context.switchToHttp().getResponse();

        this.logger.log(
          `METHOD: '${req.method}' PATH: '${req.url}' STATUS: '${
            err.status
          }' TIME: ${after - before}ms`,
        );

        throw err;
      }),
    );
  }
}
