import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgregarProductosPage } from './agregar-productos.page';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ServicebdService } from 'src/app/services/servicebd.service';
import { Camera } from '@capacitor/camera';
import { of } from 'rxjs';

describe('AgregarProductosPage', () => {
  let component: AgregarProductosPage;
  let fixture: ComponentFixture<AgregarProductosPage>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockToastController: jasmine.SpyObj<ToastController>;
  let mockServicebd: jasmine.SpyObj<ServicebdService>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockToastController = jasmine.createSpyObj('ToastController', ['create']);
    mockServicebd = jasmine.createSpyObj('ServicebdService', ['fetchCortinas', 'insertarCortina', 'modificarStock']);


    mockServicebd.fetchCortinas.and.returnValue(of([]));  

    await TestBed.configureTestingModule({
      declarations: [AgregarProductosPage],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ToastController, useValue: mockToastController },
        { provide: ServicebdService, useValue: mockServicebd },
        { provide: Camera, useValue: {} }, 
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AgregarProductosPage);
    component = fixture.componentInstance;
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();  
  });
});
