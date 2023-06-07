import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TstDotConnectComponent } from './tst-dot-connect/tst-dot-connect.component';
import { ContainerComponent } from './container/container.component';
import { HorizontalScrollbarComponent } from './horizontal-scrollbar/horizontal-scrollbar.component';
import { IntegerPlatformComponent } from './integer-platform/integer-platform.component';
import { MoonsPlanetsComponent } from './moons-planets/moons-planets.component';
import { SlingshotInputComponent } from './slingshot-input/slingshot-input.component';
import { MultiplyFlowersComponent } from './multiply-flowers/multiply-flowers.component';
import { MultiplicationTableComponent } from './multiplication-table/multiplication-table.component';

@NgModule({
  declarations: [
    AppComponent,
    TstDotConnectComponent,
    ContainerComponent,
    HorizontalScrollbarComponent,
    IntegerPlatformComponent,
    MoonsPlanetsComponent,
    SlingshotInputComponent,
    MultiplyFlowersComponent,
    MultiplicationTableComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }