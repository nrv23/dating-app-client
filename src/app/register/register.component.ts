import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { IRegister } from '../interfaces/IRegister';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {

  @Output() cancelRegister = new EventEmitter<boolean>();

  registerData: IRegister = {
    username: "",
    password: ""
  };

  constructor(private accountService: AccountService,private toastr: ToastrService) { }

  ngOnInit(): void { }

  register(e: Event) {
    e.preventDefault();

    this.accountService.register(this.registerData).subscribe({
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
    });
  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}
