import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { ServicebdService } from 'src/app/services/servicebd.service';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { of } from 'rxjs';  // Importamos 'of' para crear observables mockeados

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [
        { provide: Router, useValue: { navigate: jasmine.createSpy(), events: of({}) } }, // Mock de Router con el observable events
        { provide: MenuController, useValue: { open: jasmine.createSpy(), close: jasmine.createSpy() } }, // Mock de MenuController
        { provide: ActivatedRoute, useValue: { snapshot: { data: { title: 'Inicio' } } } }, // Mock de ActivatedRoute
        { 
          provide: ServicebdService, 
          useValue: { 
            setLoggedUser: jasmine.createSpy(),
            loggedUser$: of({ nombre_usuario: 'Usuario', id_rol: 1 }),  // Mockeamos el observable loggedUser$ con un valor
            cartItemCount$: of(5),  // Mockeamos el observable cartItemCount$ con un valor
          }
        }, // Mock de ServicebdService con observables de ejemplo
        { provide: SQLite, useValue: { create: jasmine.createSpy().and.returnValue(Promise.resolve()) } }, // Mock de SQLite
        { provide: Platform, useValue: { ready: jasmine.createSpy().and.returnValue(Promise.resolve()) } } // Mock de Platform
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Detecta cambios para que el componente se cree
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });
});
