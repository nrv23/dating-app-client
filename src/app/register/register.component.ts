import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { IRegister } from '../interfaces/IRegister';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {

  @Output() cancelRegister = new EventEmitter<boolean>();
  registerForm: FormGroup = new FormGroup({});
  maxDate: Date = new Date();
  validationErrors: string[] | undefined;

  constructor(private accountService: AccountService, private toastr: ToastrService, private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.iniatializeForm();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18); // validar que se ingrese una fecha de al menos 18 años de diferencia con la actual
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control.value === control.parent?.get(matchTo)?.value ? null : { noMatching: true };
    }
  }

  iniatializeForm() {
    this.registerForm = this.fb.group({

      gender: ["male"],
      username: ["", [Validators.required]],
      knownAs: ["", [Validators.required]],
      dateOfBirth: ["", [Validators.required]],
      city: ["", [Validators.required]],
      country: ["", [Validators.required]],
      password: ["", [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPass: ["", [Validators.required, this.matchValues("password")]],
    });

    this.registerForm.controls["password"].valueChanges.subscribe({
      next: () => this.registerForm.controls["confirmPass"].updateValueAndValidity() // mantener la validacion cada vez que se digita
    })
  }

  register(e: Event) {
    e.preventDefault();

    const dob = this.getDateOnly(this.registerForm.controls['dateOfBirth'].value);
    const formData = {
      ...this.registerForm.value,
      dateOfBirth: dob
    }

    this.accountService.register(formData).subscribe({
      next: (response) => {
        console.log(response)
        this.router.navigateByUrl("/members")
        this.cancel();
      },
      error: (err) => {
        this.validationErrors = err;
      },
      complete: () => { },
    });
  }

  cancel() {
    this.cancelRegister.emit(false);
  }

  private getDateOnly(dob: string | undefined) { // formatea la fecha sin el timezone para que quede con formato yyyy-mm-dd
    if (!dob) return;
    let theDbo = new Date(dob);
    return new Date(theDbo.setMinutes(theDbo.getMinutes() - theDbo.getTimezoneOffset()))
      .toISOString().slice(0, 10);
  }
}
