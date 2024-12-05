import { Component, OnInit } from '@angular/core';
import { CallNumber } from '@awesome-cordova-plugins/call-number/ngx';


@Component({
  selector: 'app-cotizar',
  templateUrl: './cotizar.page.html',
  styleUrls: ['./cotizar.page.scss'],
})
export class CotizarPage implements OnInit {

  phoneNumber: string = "+56941858750"; // Número de teléfono a llamar

  constructor(private callNumber: CallNumber) { }

  ngOnInit() {
  }

  llamar() {
    this.callNumber.callNumber(this.phoneNumber, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }

  
}
