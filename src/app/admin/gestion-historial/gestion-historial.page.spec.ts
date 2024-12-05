import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GestionHistorialPage } from './gestion-historial.page';
import { IonicModule } from '@ionic/angular';
import { ServicebdService } from 'src/app/services/servicebd.service';

describe('GestionHistorialPage', () => {
  let component: GestionHistorialPage;
  let fixture: ComponentFixture<GestionHistorialPage>;
  let service: jasmine.SpyObj<ServicebdService>;

  beforeEach(async () => {
    const mockService = jasmine.createSpyObj('ServicebdService', ['obtenerTodasLasCompras']);

    await TestBed.configureTestingModule({
      declarations: [GestionHistorialPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: ServicebdService, useValue: mockService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GestionHistorialPage);
    component = fixture.componentInstance;
    service = TestBed.inject(ServicebdService) as jasmine.SpyObj<ServicebdService>;
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });
});
