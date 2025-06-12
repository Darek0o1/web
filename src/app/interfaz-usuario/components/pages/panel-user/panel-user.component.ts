import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-panel-user',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './panel-user.component.html',
  styleUrls: ['./panel-user.component.scss'],
})
export class PanelUserComponent {
  scrollToServices(): void {
  const element = document.getElementById('quick-actions');
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}
}
