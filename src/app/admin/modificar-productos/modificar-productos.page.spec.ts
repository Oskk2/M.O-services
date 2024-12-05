import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModificarProductosPage } from './modificar-productos.page';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { ServicebdService } from 'src/app/services/servicebd.service';
import { of } from 'rxjs';

describe('ModificarProductosPage', () => {
  let component: ModificarProductosPage;
  let fixture: ComponentFixture<ModificarProductosPage>;
  let serviceBd: jasmine.SpyObj<ServicebdService>;
  let router: jasmine.SpyObj<Router>;
  let toastController: jasmine.SpyObj<ToastController>;
  let activatedRoute: any;

  beforeEach(async () => {
    const mockServiceBd = jasmine.createSpyObj('ServicebdService', ['modificarCortina']);
    const mockRouter = jasmine.createSpyObj('Router', ['navigate', 'getCurrentNavigation']);
    const mockToastController = jasmine.createSpyObj('ToastController', ['create']);
    const mockActivatedRoute = {
      queryParams: of({}),
    };

    const mockToast = { present: jasmine.createSpy('present') };
    mockToastController.create.and.returnValue(Promise.resolve(mockToast));

    await TestBed.configureTestingModule({
      declarations: [ModificarProductosPage],
      providers: [
        { provide: ServicebdService, useValue: mockServiceBd },
        { provide: Router, useValue: mockRouter },
        { provide: ToastController, useValue: mockToastController },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModificarProductosPage);
    component = fixture.componentInstance;
    serviceBd = TestBed.inject(ServicebdService) as jasmine.SpyObj<ServicebdService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    toastController = TestBed.inject(ToastController) as jasmine.SpyObj<ToastController>;
    activatedRoute = TestBed.inject(ActivatedRoute);
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });
});
