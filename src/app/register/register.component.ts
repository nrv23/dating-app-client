import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { IRegister } from '../interfaces/IRegister';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {

  @Output() cancelRegister = new EventEmitter<boolean>();
  registerForm: FormGroup  = new FormGroup({});
  registerData: IRegister = {
    username: "",
    password: ""
  };

  constructor(private accountService: AccountService,private toastr: ToastrService) { }

  ngOnInit(): void {
    this.iniatializeForm();
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control.value === control.parent?.get(matchTo)?.value? null: {noMatching: true};
    }
  }

  iniatializeForm() {
    this.registerForm = new FormGroup({

      username: new FormControl("",[Validators.required]),
      password: new FormControl("",[Validators.required, Validators.minLength(4), Validators.maxLength(8)]),
      confirmPass: new FormControl("",[Validators.required, this.matchValues("password")]),
    });

    this.registerForm.controls["password"].valueChanges.subscribe({
      next: () => this.registerForm.controls["confirmPass"].updateValueAndValidity() // mantener la validacion cada vez que se digita
    })
  }

  register(e: Event) {
    e.preventDefault();

    console.log(this.registerForm?.value);

    /*this.accountService.register(this.registerData).subscribe({
      next: (response) => {
        console.log(response)
        this.cancel();
       },
      error: (err) => { 
        const { error } = err;
        if(error.msg) {
          this.toastr.error(error.msg,"Ha ocurrido un error");
        }

        if(error.errors){
          const errors : string[] = [];  
          for (const key of Object.keys(error.errors)) {
            errors.push(error.errors[key]);
          }
          this.toastr.error(errors.toString().replace(',',''),"Ha ocurrido un error");
        }
          
      },
      complete: () => { },
    });*/
  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}
