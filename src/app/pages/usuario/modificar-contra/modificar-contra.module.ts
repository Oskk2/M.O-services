import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModificarContraPageRoutingModule } from './modificar-contra-routing.module';

import { ModificarContraPage } from './modificar-contra.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModificarContraPageRoutingModule
  ],
  declarations: [ModificarContraPage]
})
export class ModificarContraPageModule {}
