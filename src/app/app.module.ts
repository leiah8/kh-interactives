import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TstDotConnectComponent } from './tst-dot-connect/tst-dot-connect.component';
import { ContainerComponent } from './container/container.component';
import { HorizontalScrollbarComponent } from './horizontal-scrollbar/horizontal-scrollbar.component';

@NgModule({
  declarations: [
    AppComponent,
    TstDotConnectComponent,
    ContainerComponent,
    HorizontalScrollbarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
