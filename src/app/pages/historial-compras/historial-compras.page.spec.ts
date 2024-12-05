import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistorialComprasPage } from './historial-compras.page';
import { IonicModule } from '@ionic/angular';
import { ServicebdService } from 'src/app/services/servicebd.service';
import { CurrentyService } from 'src/app/services/currenty.service';
import { of } from 'rxjs';

describe('HistorialComprasPage', () => {
  let component: HistorialComprasPage;
  let fixture: ComponentFixture<HistorialComprasPage>;
  let serviceBd: jasmine.SpyObj<ServicebdService>;
  let currentyService: jasmine.SpyObj<CurrentyService>;

  beforeEach(async () => {
    const mockServiceBd = jasmine.createSpyObj('ServicebdService', ['obtenerTodasLasCompras', 'obtenerComprasUsuario']);
    const mockCurrentyService = jasmine.createSpyObj('CurrentyService', ['getExchangeRate']);

    mockServiceBd.obtenerTodasLasCompras.and.returnValue(Promise.resolve([]));
    mockServiceBd.obtenerComprasUsuario.and.returnValue(Promise.resolve([]));
    mockCurrentyService.getExchangeRate.and.returnValue(of({ conversion_rates: { CLP: 900 } }));

    await TestBed.configureTestingModule({
      declarations: [HistorialComprasPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: ServicebdService, useValue: mockServiceBd },
        { provide: CurrentyService, useValue: mockCurrentyService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HistorialComprasPage);
    component = fixture.componentInstance;
    serviceBd = TestBed.inject(ServicebdService) as jasmine.SpyObj<ServicebdService>;
    currentyService = TestBed.inject(CurrentyService) as jasmine.SpyObj<CurrentyService>;
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });
});
