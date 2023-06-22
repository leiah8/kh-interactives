import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TstDotConnectComponent } from './tst-dot-connect/tst-dot-connect.component';
import { ContainerComponent } from './container/container.component';
import { HorizontalScrollbarComponent } from './horizontal-scrollbar/horizontal-scrollbar.component';
import { IntegerPlatformComponent } from './integer-platform/integer-platform.component';
import { MoonsPlanetsComponent } from './moons-planets/moons-planets.component';
import { MultiplyFlowersComponent } from './multiply-flowers/multiply-flowers.component';
import { MultiplicationTableComponent } from './multiplication-table/multiplication-table.component';
import { ZoomPlanetsComponent } from './zoom-planets/zoom-planets.component';
import { MultiplyManyFlowersComponent } from './multiply-many-flowers/multiply-many-flowers.component';
import { TextureSwapComponent } from './texture-swap/texture-swap.component';
import { MsgsComponent } from './msgs/msgs.component';

@NgModule({
  declarations: [
    AppComponent,
    TstDotConnectComponent,
    ContainerComponent,
    HorizontalScrollbarComponent,
    IntegerPlatformComponent,
    MoonsPlanetsComponent,
    MultiplyFlowersComponent,
    MultiplicationTableComponent,
    ZoomPlanetsComponent,
    MultiplyManyFlowersComponent,
    TextureSwapComponent,
    MsgsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
