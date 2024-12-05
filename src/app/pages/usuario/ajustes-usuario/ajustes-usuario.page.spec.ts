import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AjustesUsuarioPage } from './ajustes-usuario.page';
import { IonicModule, NavController } from '@ionic/angular';
import { ServicebdService } from 'src/app/services/servicebd.service';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

describe('AjustesUsuarioPage', () => {
  let component: AjustesUsuarioPage;
  let fixture: ComponentFixture<AjustesUsuarioPage>;
  let servicebd: jasmine.SpyObj<ServicebdService>;
  let router: jasmine.SpyObj<Router>;
  let navController: jasmine.SpyObj<NavController>;

  beforeEach(async () => {
    const mockLoggedUser$ = new BehaviorSubject(null); // Simula el observable `loggedUser$`.

    const mockServicebd = jasmine.createSpyObj('ServicebdService', ['setLoggedUser', 'logout'], {
      loggedUser$: mockLoggedUser$,
    });

    const mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    const mockNavController = jasmine.createSpyObj('NavController', ['navigateRoot', 'navigateForward']);

    await TestBed.configureTestingModule({
      declarations: [AjustesUsuarioPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: ServicebdService, useValue: mockServicebd },
        { provide: Router, useValue: mockRouter },
        { provide: NavController, useValue: mockNavController },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AjustesUsuarioPage);
    component = fixture.componentInstance;
    servicebd = TestBed.inject(ServicebdService) as jasmine.SpyObj<ServicebdService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    navController = TestBed.inject(NavController) as jasmine.SpyObj<NavController>;
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });
});
