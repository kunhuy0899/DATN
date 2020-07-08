import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {Web1component} from './web1/web1.component';
import {Web2component} from './web2/web2.component';4
import {AdminComponent} from './admin/admin.component';

const heroesRoutes: Routes = [
    {path:'Web1' ,component:Web1component},
    {path:'Web2' ,component:Web2component},
    {path:'Admin' ,component:AdminComponent},
];

@NgModule({
  imports: [
    RouterModule.forChild(heroesRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class TemplateRoutingModule { }