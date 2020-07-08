import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';



import { TemplateRoutingModule } from './template-routing.module';

import {Web1component} from './web1/web1.component';
import {Web2component} from './web2/web2.component';
import {AdminComponent} from './admin/admin.component'
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TemplateRoutingModule
  ],
  declarations: [
    Web1component,
    Web2component,
    AdminComponent
  ]
})
export class TemplateModule {}