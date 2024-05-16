import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Route } from '@angular/router';
import { AppComponent } from './app/app.component';
import { FormularioComponent } from './app/formulario/formulario.component';

const routes: Route[] = [
  { path: '', component: FormularioComponent } // Define a rota raiz para o FormularioComponent
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes)
  ]
}).catch(err => console.error(err));

