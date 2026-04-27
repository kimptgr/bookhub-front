import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoixUtilisateur } from './choix-utilisateur';

describe('ChoixUtilisateur', () => {
  let component: ChoixUtilisateur;
  let fixture: ComponentFixture<ChoixUtilisateur>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChoixUtilisateur]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChoixUtilisateur);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
