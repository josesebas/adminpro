import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule }from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
//sockets
//import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { APP_ROUTES } from './app.routes';

import { LoginService } from './services/login.service';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';


import { PagesModule } from './pages/pages.module';

// import { environment }  from '../environments/environment';
// const config:SocketIoConfig={
//   url : environment.wsUrl, options:{}
// }

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,

  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    APP_ROUTES,
    PagesModule,
    FormsModule,
    NgbModule
    // SocketIoModule.forRoot(config)
  ],
  providers: [
    LoginService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
