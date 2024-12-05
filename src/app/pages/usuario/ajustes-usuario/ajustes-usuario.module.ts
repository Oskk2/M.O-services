import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AjustesUsuarioPageRoutingModule } from './ajustes-usuario-routing.module';

import { AjustesUsuarioPage } from './ajustes-usuario.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AjustesUsuarioPageRoutingModule
  ],
  declarations: [AjustesUsuarioPage]
})
export class AjustesUsuarioPageModule {}
