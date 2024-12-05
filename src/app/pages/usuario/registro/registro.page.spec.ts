import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistroPage } from './registro.page';
import { ServicebdService } from 'src/app/services/servicebd.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { of, throwError } from 'rxjs';

describe('RegistroPage', () => {
  let component: RegistroPage;
  let fixture: ComponentFixture<RegistroPage>;
  let servicebdService: jasmine.SpyObj<ServicebdService>;
  let toastController: jasmine.SpyObj<ToastController>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const spyService = jasmine.createSpyObj('ServicebdService', ['verificarCorreo', 'agregarUsuario']);
    const spyToast = jasmine.createSpyObj('ToastController', ['create']);
    const spyRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [ RegistroPage ],
      providers: [
        { provide: ServicebdService, useValue: spyService },
        { provide: ToastController, useValue: spyToast },
        { provide: Router, useValue: spyRouter }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroPage);
    component = fixture.componentInstance;
    servicebdService = TestBed.inject(ServicebdService) as jasmine.SpyObj<ServicebdService>;
    toastController = TestBed.inject(ToastController) as jasmine.SpyObj<ToastController>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería mostrar un mensaje de error si los campos son obligatorios', async () => {
    // Simulamos que los campos están vacíos
    component.nombre_usuario = '';
    component.apellido_usuario = '';
    component.correo = '';
    component.contrasena = '';
    component.confirmarContra = '';
    
    // Ejecutamos el método registrar
    await component.registrar();

    // Verificamos que los mensajes de error se hayan asignado correctamente
    expect(component.errorNombre).toBe('El nombre es obligatorio.');
    expect(component.errorApellido).toBe('El apellido es obligatorio.');
    expect(component.errorCorreo).toBe('El correo electrónico es obligatorio.');
    expect(component.errorContra).toBe('La contraseña es obligatoria.');
    expect(component.errorConfirmarContra).toBe('Debes confirmar la contraseña.');
  });
  
});