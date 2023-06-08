import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ToastrModule } from 'ngx-toastr';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BsDropdownModule.forRoot(),
    ToastrModule.forRoot({
      positionClass: "toast-bottom-right"
    })
  ],
  exports: [ // se exportan para que se puedan cargar al app.module.
  // de esta froma se pueden generar modulos para cada contexto de la aplicacion
    BsDropdownModule,
    ToastrModule
  ]
})
export class SharedModule { }
