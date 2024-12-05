import { Injectable } from '@angular/core';
import * as emailjs from 'emailjs-com';

@Injectable({
  providedIn: 'root'
})
export class EmailjsService {
  constructor() {}

  enviarCorreoVerificacion(correo: string, codigo: string) {
    const templateParams = {
      correo_usuario: correo,
      codigo_verificacion: codigo
    };

    return emailjs.send('service_4vmlvu8', 'template_7p14crk', templateParams, '9uvfTn0qfylIv73Sj');
  }
}
