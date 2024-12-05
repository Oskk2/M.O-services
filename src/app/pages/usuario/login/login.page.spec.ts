import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginPage } from './login.page';
import { IonicModule, ToastController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ServicebdService } from 'src/app/services/servicebd.service';
import { AppComponent } from 'src/app/app.component';
import { NavController } from '@ionic/angular';


describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let toastController: jasmine.SpyObj<ToastController>;
  let alertController: jasmine.SpyObj<AlertController>;
  let router: jasmine.SpyObj<Router>;
  let servicebd: jasmine.SpyObj<ServicebdService>;
  let appComponent: jasmine.SpyObj<AppComponent>;

  beforeEach(async () => {
    const mockNavController = jasmine.createSpyObj('NavController', ['navigateForward', 'navigateBack']);
    const mockToastController = jasmine.createSpyObj('ToastController', ['create']);
    const mockAlertController = jasmine.createSpyObj('AlertController', ['create']);
    const mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    const mockServicebd = jasmine.createSpyObj('ServicebdService', ['validarUsuario', 'cargarCarritoUsuario']);
    const mockAppComponent = jasmine.createSpyObj('AppComponent', ['updateMenu']); 
  
    const mockToast = { present: jasmine.createSpy('present') };
    const mockAlert = { present: jasmine.createSpy('present') };
  
    mockToastController.create.and.returnValue(Promise.resolve(mockToast as any));
    mockAlertController.create.and.returnValue(Promise.resolve(mockAlert as any));
  
    await TestBed.configureTestingModule({
      declarations: [LoginPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: ToastController, useValue: mockToastController },
        { provide: AlertController, useValue: mockAlertController },
        { provide: Router, useValue: mockRouter },
        { provide: ServicebdService, useValue: mockServicebd },
        { provide: AppComponent, useValue: mockAppComponent },
        { provide: NavController, useValue: mockNavController }, 
      ],
    }).compileComponents();
  
    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    toastController = TestBed.inject(ToastController) as jasmine.SpyObj<ToastController>;
    alertController = TestBed.inject(AlertController) as jasmine.SpyObj<AlertController>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    servicebd = TestBed.inject(ServicebdService) as jasmine.SpyObj<ServicebdService>;
    appComponent = TestBed.inject(AppComponent) as jasmine.SpyObj<AppComponent>;
  });
  

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería mostrar un error si el correo está vacío', async () => {
    component.correo = '';
    component.contrasena = 'Lucas123';
    await component.logearse();
    expect(component.errorCorreo).toBe('El correo electrónico es obligatorio.');
  });

  it('debería mostrar un error si la contraseña está vacía', async () => {
    component.correo = 'lucas@gmail.com';
    component.contrasena = '';
    await component.logearse();
    expect(component.errorContra).toBe('La contraseña es obligatoria.');
  });

  it('debería mostrar un toast si las credenciales son incorrectas', async () => {
    component.correo = 'lucas@gmail.com';
    component.contrasena = 'incorrecta';

    servicebd.validarUsuario.and.throwError('Credenciales incorrectas');

    await component.logearse();

    expect(toastController.create).toHaveBeenCalledWith({
      message: 'Credenciales incorrectas',
      duration: 2000,
      position: 'bottom',
      color: 'danger',
    });
  });
});
