import {ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';
import { fr } from 'primelocale/fr.json';
import Aura from '@primeuix/themes/aura';

import {routes} from './app.routes';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {providePrimeNG} from 'primeng/config';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/authInterceptor';
import {MessageService} from 'primeng/api';
import {DatePipe} from '@angular/common';

export const appConfig: ApplicationConfig = {
  providers: [
    DatePipe,
    provideHttpClient(withInterceptors([authInterceptor])),
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideAnimationsAsync(),
    providePrimeNG({
      translation: fr,
      theme: {
        preset: Aura,
      },
    }),
    MessageService,
  ]
};
