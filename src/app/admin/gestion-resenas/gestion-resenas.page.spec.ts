import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GestionResenasPage } from './gestion-resenas.page';
import { IonicModule } from '@ionic/angular';
import { ServicebdService } from 'src/app/services/servicebd.service';
import { of } from 'rxjs';

describe('GestionResenasPage', () => {
  let component: GestionResenasPage;
  let fixture: ComponentFixture<GestionResenasPage>;
  let service: jasmine.SpyObj<ServicebdService>;

  beforeEach(async () => {
    const mockService = jasmine.createSpyObj('ServicebdService', ['dbState', 'fetchResenas', 'banearResena']);
    
    mockService.dbState.and.returnValue(of(true));
    mockService.fetchResenas.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      declarations: [GestionResenasPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: ServicebdService, useValue: mockService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GestionResenasPage);
    component = fixture.componentInstance;
    service = TestBed.inject(ServicebdService) as jasmine.SpyObj<ServicebdService>;
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });
});
