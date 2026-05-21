import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Workflows Component
 * Workflows management feature page
 */
@Component({
  selector: 'app-workflows',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="workflows-container">
      <h1>Workflows</h1>
      <p>Manage and monitor your automation workflows.</p>

      <div class="workflows-toolbar">
        <button class="btn btn-primary">Create Workflow</button>
        <input
          type="text"
          placeholder="Search workflows..."
          class="search-input"
          aria-label="Search workflows"
        />
      </div>

      <section class="workflows-table">
        <table>
          <thead>
            <tr>
              <th scope="col">Workflow Name</th>
              <th scope="col">Status</th>
              <th scope="col">Created</th>
              <th scope="col">Last Run</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Email Campaign</td>
              <td><span class="badge badge-active">Active</span></td>
              <td>2 days ago</td>
              <td>1 hour ago</td>
              <td><button class="btn btn-primary btn-sm">Edit</button></td>
            </tr>
            <tr>
              <td>Report Generation</td>
              <td><span class="badge badge-active">Active</span></td>
              <td>1 week ago</td>
              <td>Yesterday</td>
              <td><button class="btn btn-primary btn-sm">Edit</button></td>
            </tr>
            <tr>
              <td>Data Sync</td>
              <td><span class="badge badge-inactive">Inactive</span></td>
              <td>2 weeks ago</td>
              <td>Never</td>
              <td><button class="btn btn-primary btn-sm">Edit</button></td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  `,
  styles: [
    `
      .workflows-container {
        padding: 2rem;
        max-width: 1200px;
        margin: 0 auto;
      }

      h1 {
        margin-bottom: 1rem;
        font-size: 2rem;
      }

      p {
        color: var(--lab-ink-soft);
        margin-bottom: 2rem;
      }

      .workflows-toolbar {
        display: flex;
        gap: 1rem;
        margin-bottom: 2rem;
      }

      .search-input {
        flex: 1;
        padding: 0.75rem;
        border: 1px solid var(--lab-line);
        border-radius: 4px;
        font-size: 1rem;
      }

      .workflows-table {
        overflow-x: auto;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        background: var(--lab-surface);
        border: 1px solid var(--lab-line);
        border-radius: 4px;
        overflow: hidden;
      }

      thead {
        background: var(--lab-surface);
        border-bottom: 2px solid var(--lab-line);
      }

      th {
        padding: 1rem;
        text-align: left;
        font-weight: 600;
      }

      td {
        padding: 1rem;
        border-bottom: 1px solid var(--lab-line);
      }

      .badge {
        padding: 0.25rem 0.75rem;
        border-radius: 999px;
        font-size: 0.85rem;
        font-weight: 600;
      }

      .badge-active {
        background: color-mix(in srgb, var(--lab-color-primary) 16%, var(--lab-surface));
        color: var(--lab-color-primary-strong);
      }

      .badge-inactive {
        background: color-mix(in srgb, var(--lab-ink-soft) 18%, var(--lab-surface));
        color: var(--lab-ink);
      }
    `,
  ],
})
export class WorkflowsComponent {}
