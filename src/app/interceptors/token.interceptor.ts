import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import UserService from '@services/user.service';
import { Observable } from 'rxjs';

const TokenInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const us: UserService = inject(UserService);

  req = req.clone({
    setHeaders: {
      Authorization: us.logged && us.token ? us.token : '',
    },
  });

  return next(req);
};
export default TokenInterceptor;
