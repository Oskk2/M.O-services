import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PostventaPageRoutingModule } from './postventa-routing.module';

import { PostventaPage } from './postventa.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PostventaPageRoutingModule
  ],
  declarations: [PostventaPage]
})
export class PostventaPageModule {}
