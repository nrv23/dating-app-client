import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { IRegister } from '../interfaces/IRegister';
import { AccountService } from '../_services/account.service';

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

  constructor(private accountService: AccountService) { }

  ngOnInit(): void { }

  register(e: Event) {
    e.preventDefault();

    this.accountService.register(this.registerData).subscribe({
      next: (response) => {
        console.log(response)
        this.cancel();
       },
      error: (err) => { 
        console.error(err.error)
      },
      complete: () => { },
    });
  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}
