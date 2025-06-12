import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-layout-user',
  standalone: true,
  templateUrl: './dashboard-layout-user.component.html',
  styleUrls: ['./dashboard-layout-user.component.scss'],
  imports: [RouterModule]
})
export class DashboardLayoutUserComponent {
  constructor(private router: Router) {}

  logout(): void {
    this.router.navigate(['/login']);
  }
}

