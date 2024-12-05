import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AyudaUsuarioPageRoutingModule } from './ayuda-usuario-routing.module';

import { AyudaUsuarioPage } from './ayuda-usuario.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AyudaUsuarioPageRoutingModule
  ],
  declarations: [AyudaUsuarioPage]
})
export class AyudaUsuarioPageModule {}
