import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModificarResenaPageRoutingModule } from './modificar-resena-routing.module';

import { ModificarResenaPage } from './modificar-resena.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModificarResenaPageRoutingModule
  ],
  declarations: [ModificarResenaPage]
})
export class ModificarResenaPageModule {}
