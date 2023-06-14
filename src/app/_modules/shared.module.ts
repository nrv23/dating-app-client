import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ToastrModule } from 'ngx-toastr';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgxGalleryModule } from '@kolkov/ngx-gallery';
import { NgxSpinnerModule } from 'ngx-spinner';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NgxGalleryModule,
    NgxSpinnerModule.forRoot({
      type: "pacman"
    }),
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ToastrModule.forRoot({
      positionClass: "toast-bottom-right"
    })
  ],
  exports: [ // se exportan para que se puedan cargar al app.module.
  // de esta froma se pueden generar modulos para cada contexto de la aplicacion
    BsDropdownModule,
    ToastrModule,
    TabsModule,
    NgxGalleryModule,
    NgxSpinnerModule
  ]
})
export class SharedModule { }
