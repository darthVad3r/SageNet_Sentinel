import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * Shell Component
 * Main layout wrapper with router outlet
 */
@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="app-shell">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [
    `
      .app-shell {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
      }
    `,
  ],
})
export class ShellComponent {}
