import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GestionPostventaPage } from './gestion-postventa.page';
import { IonicModule } from '@ionic/angular';
import { ServicebdService } from 'src/app/services/servicebd.service';
import { of, BehaviorSubject } from 'rxjs';

describe('GestionPostventaPage', () => {
  let component: GestionPostventaPage;
  let fixture: ComponentFixture<GestionPostventaPage>;
  let servicebd: jasmine.SpyObj<ServicebdService>;

  beforeEach(async () => {

    const mockServicebd = jasmine.createSpyObj('ServicebdService', ['dbState', 'fetchPostventa']);
    const mockDbState = new BehaviorSubject<boolean>(true); 
    mockServicebd.dbState.and.returnValue(mockDbState.asObservable());
    mockServicebd.fetchPostventa.and.returnValue(of([])); 

    await TestBed.configureTestingModule({
      declarations: [GestionPostventaPage],
      imports: [IonicModule.forRoot()],
      providers: [{ provide: ServicebdService, useValue: mockServicebd }],
    }).compileComponents();

    fixture = TestBed.createComponent(GestionPostventaPage);
    component = fixture.componentInstance;
    servicebd = TestBed.inject(ServicebdService) as jasmine.SpyObj<ServicebdService>;
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });
});
