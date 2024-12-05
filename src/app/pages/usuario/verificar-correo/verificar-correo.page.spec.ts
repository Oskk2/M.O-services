import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerificarCorreoPage } from './verificar-correo.page';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { EmailjsService } from 'src/app/services/emailjs.service';
import { ServicebdService } from 'src/app/services/servicebd.service';
import { of } from 'rxjs';

describe('VerificarCorreoPage', () => {
  let component: VerificarCorreoPage;
  let fixture: ComponentFixture<VerificarCorreoPage>;
  let emailjsService: jasmine.SpyObj<EmailjsService>;
  let serviceBd: jasmine.SpyObj<ServicebdService>;

  beforeEach(async () => {
    const spyEmailjsService = jasmine.createSpyObj('EmailjsService', ['enviarCorreoVerificacion']);
    const spyServiceBd = jasmine.createSpyObj('ServicebdService', ['setLoggedUser']);

    await TestBed.configureTestingModule({
      declarations: [VerificarCorreoPage],
      imports: [IonicModule.forRoot(), RouterTestingModule],
      providers: [
        { provide: EmailjsService, useValue: spyEmailjsService },
        { provide: ServicebdService, useValue: spyServiceBd }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(VerificarCorreoPage);
    component = fixture.componentInstance;
    emailjsService = TestBed.inject(EmailjsService) as jasmine.SpyObj<EmailjsService>;
    serviceBd = TestBed.inject(ServicebdService) as jasmine.SpyObj<ServicebdService>;
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });
});
