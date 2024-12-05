import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { PostventaPage } from './postventa.page';
import { ServicebdService } from 'src/app/services/servicebd.service';

describe('PostventaPage', () => {
  let component: PostventaPage;
  let fixture: ComponentFixture<PostventaPage>;
  let service: jasmine.SpyObj<ServicebdService>;
  let toastController: jasmine.SpyObj<ToastController>;

  beforeEach(async () => {
    const mockService = jasmine.createSpyObj('ServicebdService', ['insertarPostventa']);
    const mockToastController = jasmine.createSpyObj('ToastController', ['create']);
    const mockToast = {
      present: jasmine.createSpy('present'),
    };

    mockToastController.create.and.returnValue(Promise.resolve(mockToast as any));

    await TestBed.configureTestingModule({
      declarations: [PostventaPage],
      imports: [IonicModule.forRoot(), FormsModule, RouterTestingModule],
      providers: [
        { provide: ServicebdService, useValue: mockService },
        { provide: ToastController, useValue: mockToastController },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PostventaPage);
    component = fixture.componentInstance;
    service = TestBed.inject(ServicebdService) as jasmine.SpyObj<ServicebdService>;
    toastController = TestBed.inject(ToastController) as jasmine.SpyObj<ToastController>;
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  describe('postventaForm', () => {
    beforeEach(() => {
      service.insertarPostventa.and.returnValue(Promise.resolve()); 
    });

    it('debería reiniciar el formulario después de enviarlo correctamente', async () => {
      component.nombre_usuario = 'Lucas';
      component.apellido_usuario = 'Olea';
      component.correo = 'lucas@gmail.com';
      component.telefono = '941858750';
      component.comuna = 'Recoleta';
      component.descripcion = 'Descripcion Problema';

      await component.postventaForm(new Event('submit'));

      expect(component.nombre_usuario).toBe('');
      expect(component.apellido_usuario).toBe('');
      expect(component.correo).toBe('');
      expect(component.telefono).toBe('');
      expect(component.comuna).toBe('');
      expect(component.descripcion).toBe('');
    });

    it('debería llamar a insertarPostventa cuando el formulario sea válido', async () => {
      component.nombre_usuario = 'Lucas';
      component.apellido_usuario = 'Olea';
      component.correo = 'lucas@gmail.com';
      component.telefono = '941858750';
      component.comuna = 'Recoleta';
      component.descripcion = 'Descripcion Problema';

      await component.postventaForm(new Event('submit'));

      expect(service.insertarPostventa).toHaveBeenCalledWith(
        'Lucas',
        'Olea',
        'lucas@gmail.com',
        '941858750',
        'Recoleta',
        'Descripcion Problema'
      );
    });

    it('debería mostrar un mensaje de éxito después de enviarlo', async () => {
      component.nombre_usuario = 'Lucas';
      component.apellido_usuario = 'Olea';
      component.correo = 'lucas@gmail.com';
      component.telefono = '941858750';
      component.comuna = 'Recoleta';
      component.descripcion = 'Descripcion Problema';

      await component.postventaForm(new Event('submit'));

      expect(toastController.create).toHaveBeenCalledWith({
        message: '¡Postventa enviada correctamente!',
        duration: 2000,
        position: 'bottom',
        color: 'success',
      });
    });
  });
});