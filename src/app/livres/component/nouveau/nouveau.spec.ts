import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Nouveau } from './nouveau';

describe('Nouveau', () => {
  let component: Nouveau;
  let fixture: ComponentFixture<Nouveau>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Nouveau]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Nouveau);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
