import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { AppComponent } from './app.component';

import { AppService } from './app.service';
import { AppHttpInterceptorService } from './http-interceptor.service';
import { AppRoutingModule } from './helpers/app-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { WorkerService } from './services/worker/worker.service';
import { CustomMaterialModule } from 'src/custom.material';
import { CreateUserDialogComponent } from './components/dashboard/create-user-dialog/create-user-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    CreateUserDialogComponent
  ],
  imports: [
    NgxDatatableModule,
    HttpClientModule,
    CustomMaterialModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'Csrf-Token',
      headerName: 'Csrf-Token',
    }),
    AppRoutingModule
  ],
  providers: [
    AppService,
    {
      multi: true,
      provide: HTTP_INTERCEPTORS,
      useClass: AppHttpInterceptorService
    },
    WorkerService
  ],
  entryComponents: [
    CreateUserDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
