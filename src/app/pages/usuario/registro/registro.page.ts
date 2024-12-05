import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { ServicebdService } from 'src/app/services/servicebd.service';

@Component({
selector: 'app-registro',
templateUrl: './registro.page.html',
styleUrls: ['./registro.page.scss'],
})
export class RegistroPage {
    nombre_usuario: string = '';
    apellido_usuario: string = '';
    correo: string = '';
    contrasena: string = '';
    confirmarContra: string = '';

    errorNombre: string = '';
    errorApellido: string = '';
    errorCorreo: string = '';
    errorContra: string = '';
    errorConfirmarContra: string = '';

    mostrarContra: boolean = false;
    mostrarConfirmarContra: boolean = false;

    constructor(private router: Router, private toastController: ToastController, private serviceBd: ServicebdService) {}

    async registrar() {
        this.resetErrores(); // Resetear errores

        // Validar campos
        if (!this.nombre_usuario) {
            this.errorNombre = 'El nombre es obligatorio.';
        } else if (this.nombre_usuario.length < 3) {
            this.errorNombre = 'El nombre debe tener al menos 3 caracteres.';
        } else if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(this.nombre_usuario)) {
            this.errorNombre = 'El nombre solo puede contener letras y espacios.';
        }

        // Validar apellido
        if (!this.apellido_usuario) {
            this.errorApellido = 'El apellido es obligatorio.';
        } else if (this.apellido_usuario.length < 3) {
            this.errorApellido = 'El apellido debe tener al menos 3 caracteres.';
        } else if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(this.apellido_usuario)) {
            this.errorApellido = 'El apellido solo puede contener letras y espacios.';
        }

        // Validar correo
        if (!this.correo) {
            this.errorCorreo = 'El correo electrónico es obligatorio.';
        } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(this.correo)) {
            this.errorCorreo = 'Ingresa un correo electrónico válido (ejemplo@ejemplo.com).';
        } else { 
            const existeCorreo = await this.serviceBd.verificarCorreo(this.correo); 
            if (existeCorreo) {
                this.errorCorreo = 'El correo/email ya está registrado.';
            }
        }

        // Validar contraseña
        if (!this.contrasena) {
            this.errorContra = 'La contraseña es obligatoria.';
        } else if (this.contrasena.length < 5 || !/\d/.test(this.contrasena)) {
            this.errorContra = 'La contraseña debe tener al menos 5 caracteres y contener números.';
        }

        // Confirmar contraseña
        if (!this.confirmarContra) {
            this.errorConfirmarContra = 'Debes confirmar la contraseña.';
        } else if (this.contrasena !== this.confirmarContra) {
            this.errorConfirmarContra = 'Las contraseñas no son iguales.';
        }

        // Comprobar si hay errores
        if (this.errorNombre || this.errorApellido || this.errorCorreo || this.errorContra || this.errorConfirmarContra) {
            return; 
        }

        try {
        await this.serviceBd.agregarUsuario(this.nombre_usuario, this.apellido_usuario, this.correo, this.contrasena);
            await this.mostrarToast('Registro exitoso', 'success', 'top');
            this.router.navigate(['/login']);
        } catch (error) {
            await this.mostrarToast('Error al registrar el usuario', 'danger', 'bottom');
        }
    }

    private async mostrarToast(mensaje:string,color:string, position: 'top' | 'middle' | 'bottom'){
        const toast= await this.toastController.create({
            message : mensaje,
            duration :2000,
            position: position,
            color
        });
        toast.present();
    }

    private validarEmail(email: string): boolean {
        const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/; // Patrón básico para validar correos electrónicos
        return emailPattern.test(email);
    }

    toggleMostrarContra() {
        this.mostrarContra = !this.mostrarContra;
      }
    
      toggleMostrarConfirmarContra() {
        this.mostrarConfirmarContra = !this.mostrarConfirmarContra;
      }

      private resetErrores() {
        this.errorNombre = '';
        this.errorApellido = '';
        this.errorCorreo = '';
        this.errorContra = '';
        this.errorConfirmarContra = '';
    }

}