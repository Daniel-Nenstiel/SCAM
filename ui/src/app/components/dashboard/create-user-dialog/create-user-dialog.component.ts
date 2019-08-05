import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { User } from 'src/app/models/user.model';
import { WorkerService } from 'src/app/services/worker/worker.service';
import { RequestService } from 'src/app/services/request/request.service';

@Component({
  selector: 'app-create-user-dialog',
  templateUrl: './create-user-dialog.component.html',
  styleUrls: ['./create-user-dialog.component.css']
})
export class CreateUserDialogComponent implements OnInit {

  passwordHide: boolean;

  userForm: FormGroup
  profileForm: FormGroup

  alertMessage: string
  alertType: string

  user: User

  disableSubmit: boolean

  constructor(
    private worker: WorkerService,
    private dialogRef: MatDialogRef<CreateUserDialogComponent>,
    private request: RequestService
  ) { }

  ngOnInit() {
    this.passwordHide = true; this.disableSubmit = false;
    this.initForm();
  }

  initForm() {
    this.userForm = new FormGroup({})
    this.profileForm = new FormGroup({})

    this.userForm.addControl('username', new FormControl('', Validators.required))
    this.userForm.addControl('password', new FormControl('', Validators.required))
    this.userForm.addControl('arbitrary-num', new FormControl('', Validators.pattern(
      /^[0-9]+\.?[0-9]*$/
      )
    ));

    this.profileForm.addControl('first-name', new FormControl('', Validators.required))
    this.profileForm.addControl('last-name', new FormControl(''))
  }

  assignDefaults() {
    this.user.status = 1;
    this.user["date-created"] = new Date().valueOf();
  }

  onClickClose() {
    this.dialogRef.close();
  }

  onClickSubmit() {
    if(!(this.profileForm.valid && this.userForm.valid)) {
      this.alertType = 'warning';
      this.alertMessage = 'Username, Password, Arbitrary-num, and First-name are all required'
    }
    else {
      this.user = this.userForm.value;
      this.user.profile = this.profileForm.value;
      this.worker.deleteEmptyAndNull(this.user);

      this.assignDefaults();
      this.user["arbitrary-num"] = Number(this.user["arbitrary-num"])

      console.log(this.user);
      this.request.createSomething({'g':'users'}, this.user)
      .subscribe({
        next: response => {
          this.disableSubmit = true;
          console.log(response);
          this.alertMessage = 'User created';
          this.alertType = 'success';
        },
        error: err => {
          this.disableSubmit = true;
          console.log(err);
          this.alertMessage = 'Something happened try again later';
          this.alertType = 'danger';
        }
      })
    }
  }
}
