



import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { ServicebdService } from 'src/app/services/servicebd.service';

@Component({
  selector: 'app-postventa',
  templateUrl: './postventa.page.html',
  styleUrls: ['./postventa.page.scss'],
})
export class PostventaPage implements OnInit {
  // Campos del formulario
  nombre_usuario = '';
  apellido_usuario = '';
  correo = '';
  telefono = '';
  comuna = '';
  descripcion = '';

  // Mensajes de error
  errorNombre = '';
  errorApellido = '';
  errorCorreo = '';
  errorTelefono = '';
  errorComuna = '';
  errorDescripcion = '';

  constructor(
    private bd: ServicebdService,
    private router: Router,
    private activedroute: ActivatedRoute,
    private toastController: ToastController
  ) {}

  ngOnInit() {}

  /**
   * Maneja el envío del formulario y realiza las validaciones necesarias.
   */
  postventaForm(event: Event): void {
    event.preventDefault();
    this.resetErrores();

    const isValid = this.validarCampos();
    if (!isValid) return;

    this.bd.insertarPostventa(
      this.nombre_usuario,
      this.apellido_usuario,
      this.correo,
      this.telefono,
      this.comuna,
      this.descripcion
    );

    this.mostrarToast('¡Postventa enviada correctamente!', 'success', 'bottom');
    this.resetForm();
  }

  /**
   * Realiza las validaciones para cada campo del formulario.
   * @returns boolean - true si todos los campos son válidos, false de lo contrario.
   */
  private validarCampos(): boolean {
    let isValid = true;

    // Validación del nombre
    if (!this.nombre_usuario) {
      this.errorNombre = 'El nombre es obligatorio.';
      isValid = false;
    } else if (!/^[a-zA-ZñÑ\s]+$/.test(this.nombre_usuario)) {
      this.errorNombre = 'El nombre no debe contener caracteres especiales o números.';
      isValid = false;
    } else if (this.nombre_usuario.trim().length < 3) {
      this.errorNombre = 'El nombre debe tener al menos 3 caracteres.';
      isValid = false;
    }

    // Validación del apellido
    if (!this.apellido_usuario) {
      this.errorApellido = 'El apellido es obligatorio.';
      isValid = false;
    } else if (!/^[a-zA-ZñÑ\s]+$/.test(this.apellido_usuario)) {
      this.errorApellido = 'El apellido no debe contener caracteres especiales o números.';
      isValid = false;
    } else if (this.apellido_usuario.trim().length < 3) {
      this.errorApellido = 'El apellido debe tener al menos 3 caracteres.';
      isValid = false;
    }

    // Validación del correo
    if (!this.correo) {
      this.errorCorreo = 'El correo electrónico es obligatorio.';
      isValid = false;
    } else if (!this.validarEmail(this.correo)) {
      this.errorCorreo = 'Ingresa un correo electrónico válido.';
      isValid = false;
    }

    // Validación del teléfono
    if (!this.telefono) {
      this.errorTelefono = 'El número de teléfono es obligatorio.';
      isValid = false;
    } else if (!/^\d{9}$/.test(this.telefono)) {
      this.errorTelefono = 'El número de teléfono debe tener 9 dígitos.';
      isValid = false;
    }

    // Validación de la comuna
    if (!this.comuna) {
      this.errorComuna = 'La comuna es obligatoria.';
      isValid = false;
    } else if (!/^[a-zA-ZñÑ\s]+$/.test(this.comuna)) {
      this.errorComuna = 'La comuna no debe contener caracteres especiales o números.';
      isValid = false;
    } else if (this.comuna.trim().length < 5) {
      this.errorComuna = 'La comuna debe tener al menos 5 caracteres.';
      isValid = false;
    }

    // Validación de la descripción
    if (!this.descripcion) {
      this.errorDescripcion = 'La descripción es obligatoria.';
      isValid = false;
    } else if (this.descripcion.trim().length < 10) {
      this.errorDescripcion = 'La descripción debe tener al menos 10 caracteres.';
      isValid = false;
    }

    return isValid;
  }

  /**
   * Muestra un toast con el mensaje proporcionado.
   * @param message - Mensaje a mostrar
   * @param color - Color del toast
   * @param position - Posición del toast
   */
  private async mostrarToast(message: string, color: string, position: 'top' | 'middle' | 'bottom'): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position,
      color,
    });
    await toast.present();
  }

  /**
   * Reinicia el formulario y los mensajes de error.
   */
  resetForm(): void {
    this.nombre_usuario = '';
    this.apellido_usuario = '';
    this.correo = '';
    this.telefono = '';
    this.comuna = '';
    this.descripcion = '';
    this.resetErrores();
  }

  /**
   * Reinicia los mensajes de error.
   */
  private resetErrores(): void {
    this.errorNombre = '';
    this.errorApellido = '';
    this.errorCorreo = '';
    this.errorTelefono = '';
    this.errorComuna = '';
    this.errorDescripcion = '';
  }

  /**
   * Valida si el formato del correo es válido.
   * @param email - Correo a validar
   * @returns boolean - true si el correo es válido, false de lo contrario.
   */
  private validarEmail(email: string): boolean {
    const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    return emailPattern.test(email);
  }
}
