import { ApplicationConfig } from '@angular/core';
import {
  InMemoryScrollingFeature,
  InMemoryScrollingOptions,
  provideRouter,
  withInMemoryScrolling,
} from '@angular/router';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from 'src/app/app.routes';
import { TokenInterceptor } from 'src/app/interceptors/token.interceptor';
import { provideCore } from 'src/app/modules/core';

const scrollConfig: InMemoryScrollingOptions = {
  scrollPositionRestoration: 'top',
  anchorScrolling: 'enabled',
};
const inMemoryScrollingFeature: InMemoryScrollingFeature =
  withInMemoryScrolling(scrollConfig);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, inMemoryScrollingFeature),
    provideHttpClient(withInterceptors([TokenInterceptor])),
    provideCore(),
  ],
};
