import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstBiblioComponent } from './const-biblio.component';

describe('ConstBiblioComponent', () => {
  let component: ConstBiblioComponent;
  let fixture: ComponentFixture<ConstBiblioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConstBiblioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConstBiblioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
