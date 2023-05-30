import {ActivatedRoute} from "@angular/router";
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContainerComponent } from './container/container.component';
import { IntegerPlatformComponent } from './integer-platform/integer-platform.component';
import { MoonsPlanetsComponent } from './moons-planets/moons-planets.component';
import { SlingshotInputComponent } from './slingshot-input/slingshot-input.component';


const routes: Routes = [
  { path: 'scrollbar', component: ContainerComponent },
  { path: 'moonsplanets', component: MoonsPlanetsComponent },
  { path: 'moonsplanets/:groups', component: MoonsPlanetsComponent },
  { path: 'minecart/:addRemove/:useImgs', component: IntegerPlatformComponent },
  { path: 'minecart', component: IntegerPlatformComponent },
  { path: 'slingshot', component: SlingshotInputComponent },
  
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 
}


