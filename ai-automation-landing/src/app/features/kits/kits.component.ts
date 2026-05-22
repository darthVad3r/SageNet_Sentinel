import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-kits',
  standalone: true,
  template: `
    <section class="kits surface-card" aria-label="Kits workspace">
      <p class="kits__eyebrow">Kits</p>
      <h1>Implementation Kits</h1>
      <p class="kits__subtitle">
        Publish, version, and monitor reusable implementation kits for workflow delivery teams.
      </p>

      <div class="kits__table-wrap surface-card surface-card--muted">
        <table>
          <caption class="kits__caption">
            Available implementation kits with publication status, version, and last update.
          </caption>
          <thead>
            <tr>
              <th scope="col">Kit</th>
              <th scope="col">Status</th>
              <th scope="col">Version</th>
              <th scope="col">Updated</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Workflow Starter</td>
              <td>Published</td>
              <td>v1.2.0</td>
              <td>2 days ago</td>
            </tr>
            <tr>
              <td>Agent QA Pack</td>
              <td>Draft</td>
              <td>v0.7.4</td>
              <td>Today</td>
            </tr>
            <tr>
              <td>Routing Blueprint</td>
              <td>Published</td>
              <td>v1.0.1</td>
              <td>1 week ago</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  `,
  styles: [
    `
      .kits {
        display: grid;
        gap: var(--lab-space-4);
      }

      .kits__eyebrow {
        text-transform: uppercase;
        letter-spacing: 0.1em;
        font-size: var(--lab-text-xs);
        font-weight: 700;
        color: var(--lab-color-primary-strong);
      }

      .kits__subtitle {
        max-width: 70ch;
      }

      .kits__table-wrap {
        overflow-x: auto;
      }

      .kits__caption {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KitsComponent {}
