import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModificarProductosPageRoutingModule } from './modificar-productos-routing.module';

import { ModificarProductosPage } from './modificar-productos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModificarProductosPageRoutingModule
  ],
  declarations: [ModificarProductosPage]
})
export class ModificarProductoPageModule {}
