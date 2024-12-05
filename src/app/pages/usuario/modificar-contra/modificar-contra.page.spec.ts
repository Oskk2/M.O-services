import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModificarContraPage } from './modificar-contra.page';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { ServicebdService } from 'src/app/services/servicebd.service';

describe('ModificarContraPage', () => {
  let component: ModificarContraPage;
  let fixture: ComponentFixture<ModificarContraPage>;
  let serviceBd: jasmine.SpyObj<ServicebdService>;
  let router: jasmine.SpyObj<Router>;
  let toastController: jasmine.SpyObj<ToastController>;

  beforeEach(async () => {
    const mockServiceBd = jasmine.createSpyObj('ServicebdService', ['verificarContrasena']);
    const mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    const mockToastController = jasmine.createSpyObj('ToastController', ['create']);

    const mockToast = { present: jasmine.createSpy('present') };
    mockToastController.create.and.returnValue(Promise.resolve(mockToast));

    await TestBed.configureTestingModule({
      declarations: [ModificarContraPage],
      providers: [
        { provide: ServicebdService, useValue: mockServiceBd },
        { provide: Router, useValue: mockRouter },
        { provide: ToastController, useValue: mockToastController },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModificarContraPage);
    component = fixture.componentInstance;
    serviceBd = TestBed.inject(ServicebdService) as jasmine.SpyObj<ServicebdService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    toastController = TestBed.inject(ToastController) as jasmine.SpyObj<ToastController>;
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });
});
