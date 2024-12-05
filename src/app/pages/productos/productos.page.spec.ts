import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductosPage } from './productos.page';
import { IonicModule, ToastController } from '@ionic/angular';
import { ServicebdService } from 'src/app/services/servicebd.service';
import { CurrentyService } from 'src/app/services/currenty.service';
import { of } from 'rxjs';

describe('ProductosPage', () => {
  let component: ProductosPage;
  let fixture: ComponentFixture<ProductosPage>;
  let toastController: jasmine.SpyObj<ToastController>;
  let bd: jasmine.SpyObj<ServicebdService>;
  let currentyService: jasmine.SpyObj<CurrentyService>;

  beforeEach(async () => {
    const mockToastController = jasmine.createSpyObj('ToastController', ['create']);
    const mockServicebd = jasmine.createSpyObj('ServicebdService', [
      'dbState',
      'fetchCortinas',
      'agregarProductoAlCarrito',
      'obtenerCarrito',
    ]);
    const mockCurrentyService = jasmine.createSpyObj('CurrentyService', ['getExchangeRate']);

    const mockToast = { present: jasmine.createSpy('present') };

    mockToastController.create.and.returnValue(Promise.resolve(mockToast as any));
    mockServicebd.dbState.and.returnValue(of(true));
    mockServicebd.fetchCortinas.and.returnValue(
      of([
        { id_cortina: 1, nombre: 'Cortina A', stock: 10, estado: 1, precio: 1000 },
        { id_cortina: 2, nombre: 'Cortina B', stock: 0, estado: 1, precio: 2000 },
      ])
    );
    mockServicebd.obtenerCarrito.and.returnValue([]);
    mockCurrentyService.getExchangeRate.and.returnValue(of({ conversion_rates: { CLP: 900 } }));

    await TestBed.configureTestingModule({
      declarations: [ProductosPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: ToastController, useValue: mockToastController },
        { provide: ServicebdService, useValue: mockServicebd },
        { provide: CurrentyService, useValue: mockCurrentyService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductosPage);
    component = fixture.componentInstance;
    toastController = TestBed.inject(ToastController) as jasmine.SpyObj<ToastController>;
    bd = TestBed.inject(ServicebdService) as jasmine.SpyObj<ServicebdService>;
    currentyService = TestBed.inject(CurrentyService) as jasmine.SpyObj<CurrentyService>;
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería incrementar la cantidad seleccionada si hay suficiente stock', () => {
    component.cantidadSeleccionada = 1;
    component.incrementarCantidad(5);
    expect(component.cantidadSeleccionada).toBe(2);
  });

  it('no debería incrementar la cantidad seleccionada si excede el stock disponible', () => {
    component.cantidadSeleccionada = 5;
    component.incrementarCantidad(5);
    expect(component.cantidadSeleccionada).toBe(5);
  });

  it('debería decrementar la cantidad seleccionada hasta un mínimo de 1', () => {
    component.cantidadSeleccionada = 2;
    component.decrementarCantidad();
    expect(component.cantidadSeleccionada).toBe(1);
  });

  it('debería cambiar la moneda a USD y actualizar la tasa de conversión', (done) => {
    component.cambiarMoneda({ detail: { value: 'USD' } });

    expect(currentyService.getExchangeRate).toHaveBeenCalled();
    currentyService.getExchangeRate().subscribe(() => {
      expect(component.conversionRate).toBe(900);
      done();
    });
  });

  it('debería agregar un producto al carrito si hay suficiente stock', async () => {
    const cortina = { id_cortina: 1, stock: 10 };
    await component.agregarAlCarrito(cortina, 2);

    expect(bd.agregarProductoAlCarrito).toHaveBeenCalledWith(cortina, 2);
    expect(toastController.create).toHaveBeenCalledWith({
      message: 'Producto agregado al carrito.',
      duration: 2000,
      position: 'bottom',
      color: 'success',
    });
  });

  it('no debería agregar un producto al carrito si no hay suficiente stock', async () => {
    const cortina = { id_cortina: 1, stock: 1 };
    await component.agregarAlCarrito(cortina, 2);

    expect(toastController.create).toHaveBeenCalledWith({
      message: 'Stock insuficiente para este producto.',
      duration: 2000,
      position: 'bottom',
      color: 'danger',
    });
    expect(bd.agregarProductoAlCarrito).not.toHaveBeenCalled();
  });
});
