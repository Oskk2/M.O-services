import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PerfilUsuarioPage } from './perfil-usuario.page';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { ServicebdService } from 'src/app/services/servicebd.service';
import { of } from 'rxjs';

describe('PerfilUsuarioPage', () => {
  let component: PerfilUsuarioPage;
  let fixture: ComponentFixture<PerfilUsuarioPage>;
  let serviceBd: jasmine.SpyObj<ServicebdService>;

  beforeEach(async () => {
    const spyServiceBd = jasmine.createSpyObj('ServicebdService', ['setLoggedUser']);
    
    await TestBed.configureTestingModule({
      declarations: [PerfilUsuarioPage],
      imports: [IonicModule.forRoot(), RouterTestingModule],
      providers: [
        { provide: ServicebdService, useValue: spyServiceBd }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PerfilUsuarioPage);
    component = fixture.componentInstance;
    serviceBd = TestBed.inject(ServicebdService) as jasmine.SpyObj<ServicebdService>;
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });
});
