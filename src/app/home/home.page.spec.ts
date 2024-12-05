import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomePage } from './home.page';
import { IonicModule } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { ServicebdService } from '../services/servicebd.service';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let alertController: jasmine.SpyObj<AlertController>;
  let nativeStorage: jasmine.SpyObj<NativeStorage>;
  let servicebd: jasmine.SpyObj<ServicebdService>;

  beforeEach(async () => {
    const spyAlertController = jasmine.createSpyObj('AlertController', ['create']);
    const spyNativeStorage = jasmine.createSpyObj('NativeStorage', ['getItem']);
    const spyServicebd = jasmine.createSpyObj('ServicebdService', ['setLoggedUser']);

    await TestBed.configureTestingModule({
      declarations: [HomePage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: AlertController, useValue: spyAlertController },
        { provide: NativeStorage, useValue: spyNativeStorage },
        { provide: ServicebdService, useValue: spyServicebd }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    alertController = TestBed.inject(AlertController) as jasmine.SpyObj<AlertController>;
    nativeStorage = TestBed.inject(NativeStorage) as jasmine.SpyObj<NativeStorage>;
    servicebd = TestBed.inject(ServicebdService) as jasmine.SpyObj<ServicebdService>;
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });
});
