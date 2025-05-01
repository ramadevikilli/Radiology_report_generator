import { Routes } from '@angular/router';

import { ImageComponent } from './image/image.component';
import { LoginComponent } from './login/login.component';
import { MainimageComponent } from './mainimage/mainimage.component';
import { AppComponent } from './app.component';

export const routes: Routes = [
   
    { path: 'login', component: LoginComponent },
    { path: 'mainimage', component: MainimageComponent },
    { path: 'image/:id', component: ImageComponent },
    
];
