import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { WorkflowBuilderComponent } from './workflow-builder.component';

describe('WorkflowBuilderComponent', () => {
  it('renders the workflow builder workspace', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [WorkflowBuilderComponent, RouterTestingModule],
    }).createComponent(WorkflowBuilderComponent);

    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('h1')?.textContent?.trim()).toBe('Workflow Builder');
  });

  it('adds draft steps and saves a draft summary', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [WorkflowBuilderComponent, RouterTestingModule],
    }).createComponent(WorkflowBuilderComponent);

    fixture.detectChanges();

    const component = fixture.componentInstance;
    const initialSteps = component.draft.steps.length;

    component.addStep();
    component.saveDraft();

    expect(component.draft.steps.length).toBe(initialSteps + 1);
    expect(component.saveMessage()).toContain('draft saved');
  });
});
