import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResenasPage } from './resenas.page';
import { IonicModule, ToastController } from '@ionic/angular';
import { ServicebdService } from 'src/app/services/servicebd.service';
import { BehaviorSubject } from 'rxjs';
import { Resena } from 'src/app/services/model/resena';

describe('ResenasPage - Validación de campos obligatorios', () => {
  let component: ResenasPage;
  let fixture: ComponentFixture<ResenasPage>;
  let toastController: jasmine.SpyObj<ToastController>;
  let bdService: jasmine.SpyObj<ServicebdService>;
  let listadoResenas$: BehaviorSubject<Resena[]>;

  beforeEach(async () => {
    const mockToastController = jasmine.createSpyObj('ToastController', ['create']);
    const mockBdService = jasmine.createSpyObj('ServicebdService', ['insertarResenas']);
    listadoResenas$ = new BehaviorSubject<Resena[]>([]);

    mockBdService.listadoResenas = listadoResenas$;

    mockToastController.create.and.returnValue(Promise.resolve({ present: jasmine.createSpy('present') } as any));

    await TestBed.configureTestingModule({
      declarations: [ResenasPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: ToastController, useValue: mockToastController },
        { provide: ServicebdService, useValue: mockBdService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ResenasPage);
    component = fixture.componentInstance;
    toastController = TestBed.inject(ToastController) as jasmine.SpyObj<ToastController>;
    bdService = TestBed.inject(ServicebdService) as jasmine.SpyObj<ServicebdService>;

    // Simular que un usuario está logueado
    component.userId = 1;
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería mostrar un toast si el campo "puntos_servicio" está vacío', async () => {
    component.descripcion = 'Descripción válida';
    component.puntos_calidad = 5;
    component.puntos_servicio = 0; // Campo vacío

    await component.agregarResena();

    expect(toastController.create).toHaveBeenCalledWith({
      message: 'Por favor completa todos los campos.',
      duration: 2000,
      position: 'bottom',
      color: 'danger',
    });
  });

  it('debería mostrar un toast si el campo "puntos_calidad" está vacío', async () => {
    component.descripcion = 'Descripción válida';
    component.puntos_calidad = 0; // Campo vacío
    component.puntos_servicio = 5;

    await component.agregarResena();

    expect(toastController.create).toHaveBeenCalledWith({
      message: 'Por favor completa todos los campos.',
      duration: 2000,
      position: 'bottom',
      color: 'danger',
    });
  });

  it('debería mostrar un toast si el campo "descripción" está vacío', async () => {
    component.descripcion = ''; // Campo vacío
    component.puntos_calidad = 5;
    component.puntos_servicio = 5;

    await component.agregarResena();

    expect(toastController.create).toHaveBeenCalledWith({
      message: 'Por favor completa todos los campos.',
      duration: 2000,
      position: 'bottom',
      color: 'danger',
    });
  });

  it('no debería mostrar un toast si todos los campos están completos', async () => {
    component.descripcion = 'Descripción válida';
    component.puntos_calidad = 5;
    component.puntos_servicio = 5;

    bdService.insertarResenas.and.returnValue(Promise.resolve());

    await component.agregarResena();

    expect(toastController.create).not.toHaveBeenCalledWith({
      message: 'Por favor completa todos los campos.',
      duration: 2000,
      position: 'bottom',
      color: 'danger',
    });
  });
});
