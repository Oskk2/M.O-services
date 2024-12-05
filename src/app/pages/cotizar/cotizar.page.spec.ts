import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CotizarPage } from './cotizar.page';
import { IonicModule } from '@ionic/angular';
import { CallNumber } from '@awesome-cordova-plugins/call-number/ngx';

describe('CotizarPage', () => {
  let component: CotizarPage;
  let fixture: ComponentFixture<CotizarPage>;
  let callNumber: jasmine.SpyObj<CallNumber>;

  beforeEach(async () => {
    const mockCallNumber = jasmine.createSpyObj('CallNumber', ['callNumber']);

    await TestBed.configureTestingModule({
      declarations: [CotizarPage],
      imports: [IonicModule.forRoot()],
      providers: [{ provide: CallNumber, useValue: mockCallNumber }],
    }).compileComponents();

    fixture = TestBed.createComponent(CotizarPage);
    component = fixture.componentInstance;
    callNumber = TestBed.inject(CallNumber) as jasmine.SpyObj<CallNumber>;
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });
});
