import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CurrentyService } from './currenty.service';

describe('CurrentyService', () => {
  let service: CurrentyService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], 
      providers: [CurrentyService],
    });
    service = TestBed.inject(CurrentyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); 
  });

  it('debería crear el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('debería realizar una solicitud HTTP para obtener el tipo de cambio', () => {
    const mockResponse = {
      conversion_rates: { CLP: 900 },
    };

    service.getExchangeRate().subscribe((data) => {
      expect(data).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(service['apiUrl']);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse); 
  });
});
