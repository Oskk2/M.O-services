import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecuperarContraPage } from './recuperar-contra.page';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { ServicebdService } from 'src/app/services/servicebd.service';

describe('RecuperarContraPage', () => {
  let component: RecuperarContraPage;
  let fixture: ComponentFixture<RecuperarContraPage>;
  let servicebd: jasmine.SpyObj<ServicebdService>;

  beforeEach(async () => {
    const spyService = jasmine.createSpyObj('ServicebdService', ['actualizarContra']);

    await TestBed.configureTestingModule({
      declarations: [RecuperarContraPage],
      imports: [IonicModule.forRoot(), RouterTestingModule],
      providers: [
        { provide: ServicebdService, useValue: spyService },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RecuperarContraPage);
    component = fixture.componentInstance;
    servicebd = TestBed.inject(ServicebdService) as jasmine.SpyObj<ServicebdService>;
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });
});
