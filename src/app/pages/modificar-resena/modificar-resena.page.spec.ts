import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModificarResenaPage } from './modificar-resena.page';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { ServicebdService } from 'src/app/services/servicebd.service';

describe('ModificarResenaPage', () => {
  let component: ModificarResenaPage;
  let fixture: ComponentFixture<ModificarResenaPage>;
  let servicebd: jasmine.SpyObj<ServicebdService>;

  beforeEach(async () => {
    const spyService = jasmine.createSpyObj('ServicebdService', ['modificarResena']);

    await TestBed.configureTestingModule({
      declarations: [ModificarResenaPage],
      imports: [IonicModule.forRoot(), RouterTestingModule],
      providers: [
        { provide: ServicebdService, useValue: spyService },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ModificarResenaPage);
    component = fixture.componentInstance;
    servicebd = TestBed.inject(ServicebdService) as jasmine.SpyObj<ServicebdService>;
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });
});
