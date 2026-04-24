import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffichageLivres } from './affichage-livres';

describe('AffichageLivres', () => {
  let component: AffichageLivres;
  let fixture: ComponentFixture<AffichageLivres>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AffichageLivres]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AffichageLivres);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
