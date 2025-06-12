import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstTabletsComponent } from './const-tablets.component';

describe('ConstTabletsComponent', () => {
  let component: ConstTabletsComponent;
  let fixture: ComponentFixture<ConstTabletsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConstTabletsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConstTabletsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
