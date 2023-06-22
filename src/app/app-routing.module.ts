import {ActivatedRoute} from "@angular/router";
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContainerComponent } from './container/container.component';
import { IntegerPlatformComponent } from './integer-platform/integer-platform.component';
import { MoonsPlanetsComponent } from './moons-planets/moons-planets.component';
import { MultiplyFlowersComponent } from './multiply-flowers/multiply-flowers.component';
import { MultiplicationTableComponent } from './multiplication-table/multiplication-table.component';
import { ZoomPlanetsComponent } from './zoom-planets/zoom-planets.component';
import { MultiplyManyFlowersComponent } from './multiply-many-flowers/multiply-many-flowers.component';
import { TextureSwapComponent } from './texture-swap/texture-swap.component';


const routes: Routes = [
  { path: 'scrollbar', component: ContainerComponent },
  { path: 'moonsplanets', component: MoonsPlanetsComponent },
  { path: 'singleflowers', component: MultiplyFlowersComponent },
  { path: 'flowers', component: MultiplyManyFlowersComponent },
  { path: 'moonsplanets/:groups', component: MoonsPlanetsComponent },
  { path: 'minecart/:addRemove/:useImgs', component: IntegerPlatformComponent },
  { path: 'minecart', component: IntegerPlatformComponent },
  { path: 'multtable', component: MultiplicationTableComponent },
  { path: 'zoomplanets', component: ZoomPlanetsComponent },
  { path: 'textureswap', component: TextureSwapComponent },
  
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 
}


