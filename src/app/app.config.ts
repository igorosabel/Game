import { ApplicationConfig } from '@angular/core';
import {
  InMemoryScrollingFeature,
  InMemoryScrollingOptions,
  provideRouter,
  withInMemoryScrolling,
} from '@angular/router';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import routes from '@app/app.routes';
import TokenInterceptor from '@app/interceptors/token.interceptor';
import provideCore from '@modules/core';

const scrollConfig: InMemoryScrollingOptions = {
  scrollPositionRestoration: 'top',
  anchorScrolling: 'enabled',
};
const inMemoryScrollingFeature: InMemoryScrollingFeature =
  withInMemoryScrolling(scrollConfig);

const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, inMemoryScrollingFeature),
    provideHttpClient(withInterceptors([TokenInterceptor])),
    provideCore(),
  ],
};
export default appConfig;
