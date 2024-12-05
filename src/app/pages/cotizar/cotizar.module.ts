import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CotizarPageRoutingModule } from './cotizar-routing.module';

import { CotizarPage } from './cotizar.page';

import { CallNumber } from '@awesome-cordova-plugins/call-number/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CotizarPageRoutingModule
  ],
  declarations: [CotizarPage],
  providers: [CallNumber],
})
export class CotizarPageModule {}
