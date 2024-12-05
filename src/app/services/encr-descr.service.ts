import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncrDescrService {
  private key = "encrypt!135790"; // Clave privada para cifrado

  constructor() { }

  // Método para cifrar la contraseña
  public encrypt(password: string): string {
    return CryptoJS.AES.encrypt(password, this.key).toString();
  }

  // Método para descifrar la contraseña
  public decrypt(passwordToDecrypt: string): string {
    const bytes = CryptoJS.AES.decrypt(passwordToDecrypt, this.key);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}
