import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Group } from '../../../core/models/group.models';
import { GroupService } from '../../../core/services/group.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-create-group-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './create-group-modal.html',
})
export class CreateGroupModal {
  private readonly fb = inject(FormBuilder);
  private readonly groupService = inject(GroupService);

  @Output() groupCreated = new EventEmitter<Group>();

  isSubmitting = signal(false);

  form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    description: [''],
  });

  onSubmit(): void {
    if (this.form.invalid) return;
    this.isSubmitting.set(true);

    this.groupService
      .createGroup(this.form.value)
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: (group) => {
          this.groupCreated.emit(group);
          this.form.reset();
          const closeBtn = document.getElementById('closeCreateGroupModalBtn');
          if (closeBtn) closeBtn.click();
        },
        error: () => alert('Failed to create group. Please try again.'),
      });
  }
}
