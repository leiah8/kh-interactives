import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContainerComponent } from './container/container.component';
import { IntegerPlatformComponent } from './integer-platform/integer-platform.component';


const routes: Routes = [
  { path: 'scrollbar', component: ContainerComponent },
  { path: 'minecart', component: IntegerPlatformComponent },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
