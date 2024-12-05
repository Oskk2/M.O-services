import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GestionProductosPage } from './gestion-productos.page';
import { IonicModule, ToastController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ServicebdService } from 'src/app/services/servicebd.service';
import { of } from 'rxjs';

describe('GestionProductosPage', () => {
  let component: GestionProductosPage;
  let fixture: ComponentFixture<GestionProductosPage>;
  let toastController: jasmine.SpyObj<ToastController>;
  let router: jasmine.SpyObj<Router>;
  let bd: jasmine.SpyObj<ServicebdService>;
  let navController: jasmine.SpyObj<NavController>;

  beforeEach(async () => {
    const mockToastController = jasmine.createSpyObj('ToastController', ['create']);
    const mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    const mockServicebd = jasmine.createSpyObj('ServicebdService', [
      'fetchCortinas',
      'activateProduct',
      'deactivateProduct',
    ]);
    const mockNavController = jasmine.createSpyObj('NavController', ['navigateForward']);

    mockToastController.create.and.returnValue(Promise.resolve({ present: jasmine.createSpy('present') }));

    mockServicebd.fetchCortinas.and.returnValue(
      of([
        { id_cortina: 1, nombre_cortina: 'Cortina A', descripcion: 'Desc A', precio: 1000, url_imagen: '', stock: 10, estado: 1 },
        { id_cortina: 2, nombre_cortina: 'Cortina B', descripcion: 'Desc B', precio: 2000, url_imagen: '', stock: 5, estado: 1 },
      ])
    );

    mockServicebd.activateProduct.and.returnValue(Promise.resolve());
    mockServicebd.deactivateProduct.and.returnValue(Promise.resolve());

    await TestBed.configureTestingModule({
      declarations: [GestionProductosPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: ToastController, useValue: mockToastController },
        { provide: Router, useValue: mockRouter },
        { provide: ServicebdService, useValue: mockServicebd },
        { provide: NavController, useValue: mockNavController },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GestionProductosPage);
    component = fixture.componentInstance;
    toastController = TestBed.inject(ToastController) as jasmine.SpyObj<ToastController>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    bd = TestBed.inject(ServicebdService) as jasmine.SpyObj<ServicebdService>;
    navController = TestBed.inject(NavController) as jasmine.SpyObj<NavController>;
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar productos al inicializar', () => {
    component.ngOnInit();
    expect(bd.fetchCortinas).toHaveBeenCalled();
    expect(component.cortinas.length).toBe(2);
    expect(component.cortinas[0].nombre_cortina).toBe('Cortina A');
  });

  it('debería activar un producto y mostrar un toast', async () => {
    const cortina = { id_cortina: 1, estado: 2 } as any;
    await component.toggleCortina(cortina);

    expect(bd.activateProduct).toHaveBeenCalledWith(1);
    expect(toastController.create).toHaveBeenCalledWith({
      message: 'Producto activado correctamente.',
      duration: 2000,
      position: 'bottom',
      color: 'success',
    });
    expect(cortina.estado).toBe(1);
  });

  it('debería desactivar un producto y mostrar un toast', async () => {
    const cortina = { id_cortina: 1, estado: 1 } as any;
    await component.toggleCortina(cortina);

    expect(bd.deactivateProduct).toHaveBeenCalledWith(1);
    expect(toastController.create).toHaveBeenCalledWith({
      message: 'Producto desactivado correctamente.',
      duration: 2000,
      position: 'bottom',
      color: 'danger',
    });
    expect(cortina.estado).toBe(2);
  });

  it('debería navegar a la página de agregar productos', () => {
    component.agregar();
    expect(router.navigate).toHaveBeenCalledWith(['/agregar-productos']);
  });

  it('debería navegar a la página de modificar productos con la cortina seleccionada', () => {
    const cortina = { id_cortina: 1, nombre_cortina: 'Cortina A' } as any;
    component.modificarCortina(cortina);

    expect(router.navigate).toHaveBeenCalledWith(['/modificar-productos'], {
      state: { cortinaEnviada: cortina },
    });
  });
});
