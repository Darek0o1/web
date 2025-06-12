import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardLayoutUserComponent } from './dashboard-layout-user.component';

describe('DashboardLayoutUserComponent', () => {
  let component: DashboardLayoutUserComponent;
  let fixture: ComponentFixture<DashboardLayoutUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardLayoutUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardLayoutUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
