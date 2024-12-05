import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarritoPage } from './carrito.page';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { ServicebdService } from 'src/app/services/servicebd.service';
import { CurrentyService } from 'src/app/services/currenty.service';
import { of } from 'rxjs';

describe('CarritoPage', () => {
  let component: CarritoPage;
  let fixture: ComponentFixture<CarritoPage>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockToastController: jasmine.SpyObj<ToastController>;
  let mockServicebd: jasmine.SpyObj<ServicebdService>;
  let mockCurrentyService: jasmine.SpyObj<CurrentyService>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockToastController = jasmine.createSpyObj('ToastController', ['create']);
    mockServicebd = jasmine.createSpyObj('ServicebdService', ['obtenerCarrito', 'modificarStock', 'eliminarProductoDelCarrito']);
    mockCurrentyService = jasmine.createSpyObj('CurrentyService', ['getExchangeRate']);
    
    mockCurrentyService.getExchangeRate.and.returnValue(of({ conversion_rates: { CLP: 1 } }));

    await TestBed.configureTestingModule({
      declarations: [CarritoPage],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ToastController, useValue: mockToastController },
        { provide: ServicebdService, useValue: mockServicebd },
        { provide: CurrentyService, useValue: mockCurrentyService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CarritoPage);
    component = fixture.componentInstance;
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });
});
