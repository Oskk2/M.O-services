import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AyudaUsuarioPage } from './ayuda-usuario.page';

describe('AyudaUsuarioPage', () => {
  let component: AyudaUsuarioPage;
  let fixture: ComponentFixture<AyudaUsuarioPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AyudaUsuarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
