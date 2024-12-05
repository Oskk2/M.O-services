import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModificarUsuarioPage } from './modificar-usuario.page';
import { IonicModule } from '@ionic/angular';
import { ServicebdService } from 'src/app/services/servicebd.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ModificarUsuarioPage', () => {
  let component: ModificarUsuarioPage;
  let fixture: ComponentFixture<ModificarUsuarioPage>;
  let serviceBd: jasmine.SpyObj<ServicebdService>;

  beforeEach(async () => {
    const mockServiceBd = jasmine.createSpyObj('ServicebdService', ['actualizarUsuario']);

    await TestBed.configureTestingModule({
      declarations: [ModificarUsuarioPage],
      imports: [IonicModule.forRoot(), HttpClientTestingModule],
      providers: [
        { provide: ServicebdService, useValue: mockServiceBd },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModificarUsuarioPage);
    component = fixture.componentInstance;
    serviceBd = TestBed.inject(ServicebdService) as jasmine.SpyObj<ServicebdService>;
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });
});
