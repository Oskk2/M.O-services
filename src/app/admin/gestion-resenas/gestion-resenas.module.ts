import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GestionResenasPageRoutingModule } from './gestion-resenas-routing.module';

import { GestionResenasPage } from './gestion-resenas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GestionResenasPageRoutingModule
  ],
  declarations: [GestionResenasPage]
})
export class GestionResenasPageModule {}
