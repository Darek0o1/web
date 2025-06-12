import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.scss'],
  imports: [
    RouterModule,
    FormsModule,
    CommonModule
  ]
})
export class DashboardLayoutComponent {
  showUserModal = false;

  userData = {
    username: 'Administrador'
  };

  constructor(private router: Router) {}

  logout(): void {
    this.router.navigate(['/login']);
  }

  openUserModal(): void {
    this.showUserModal = true;
  }

  closeUserModal(): void {
    this.showUserModal = false;
  }

  saveUserData(): void {
    console.log('Usuario actualizado localmente:', this.userData.username);
    this.closeUserModal();
  }
}
