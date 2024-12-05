import { TestBed } from '@angular/core/testing';
import { ServicebdService } from './servicebd.service';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { of } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

describe('ServicebdService', () => {
  let service: ServicebdService;
  let sqlite: jasmine.SpyObj<SQLite>;
  let platform: jasmine.SpyObj<Platform>;

  beforeEach(() => {
    const sqliteSpy = jasmine.createSpyObj('SQLite', ['create', 'executeSql']);
    const platformSpy = jasmine.createSpyObj('Platform', ['ready']);

    sqliteSpy.executeSql.and.returnValue(Promise.resolve({ rows: { length: 1, item: () => ({}) } }));
    platformSpy.ready.and.returnValue(Promise.resolve());

    TestBed.configureTestingModule({
      imports: [HttpClientModule], 
      providers: [
        ServicebdService,
        { provide: SQLite, useValue: sqliteSpy },
        { provide: Platform, useValue: platformSpy }
      ]
    });

    service = TestBed.inject(ServicebdService);
    sqlite = TestBed.inject(SQLite) as jasmine.SpyObj<SQLite>;
    platform = TestBed.inject(Platform) as jasmine.SpyObj<Platform>;
  });

  it('debería crear el servicio', () => {
    expect(service).toBeTruthy();
  });
});
