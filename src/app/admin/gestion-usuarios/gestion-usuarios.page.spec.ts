import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GestionUsuariosPage } from './gestion-usuarios.page';
import { IonicModule } from '@ionic/angular';
import { ServicebdService } from 'src/app/services/servicebd.service';
import { EncrDescrService } from 'src/app/services/encr-descr.service';
import { of } from 'rxjs';

describe('GestionUsuariosPage', () => {
  let component: GestionUsuariosPage;
  let fixture: ComponentFixture<GestionUsuariosPage>;
  let service: jasmine.SpyObj<ServicebdService>;
  let encryptionService: jasmine.SpyObj<EncrDescrService>;

  beforeEach(async () => {
    const mockService = jasmine.createSpyObj('ServicebdService', ['fetchUsuarios', 'banearUsuario', 'activarUsuario']);
    const mockEncryptionService = jasmine.createSpyObj('EncrDescrService', ['encrypt']);
    
    mockService.fetchUsuarios.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      declarations: [GestionUsuariosPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: ServicebdService, useValue: mockService },
        { provide: EncrDescrService, useValue: mockEncryptionService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GestionUsuariosPage);
    component = fixture.componentInstance;
    service = TestBed.inject(ServicebdService) as jasmine.SpyObj<ServicebdService>;
    encryptionService = TestBed.inject(EncrDescrService) as jasmine.SpyObj<EncrDescrService>;
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });
});
