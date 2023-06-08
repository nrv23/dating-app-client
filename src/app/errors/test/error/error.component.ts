import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {

  baseUrl = 'https://localhost:5001/api/';
  validationErrors: string[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  get404Error() {
    this.http.get(this.baseUrl.concat('bugy/not-found'))
      .subscribe({
        next : response => console.log(response),
        error: err => {
          console.log(err)
        }
      })
  }

  get400error() {
    this.http.get(this.baseUrl.concat('bugy/bad-request'))
      .subscribe({
        next : response => console.log(response),
        error: err => {
          this.validationErrors = err;
          console.log(  this.validationErrors)
        }
      })
  }

  get500Error() {
    this.http.get(this.baseUrl.concat('bugy/server-error'))
      .subscribe({
        next : response => console.log(response),
        error: err => {
          console.log(err)
        }
      })
  }

  get401Error() {
    this.http.get(this.baseUrl.concat('bugy/auth'))
      .subscribe({
        next : response => console.log(response),
        error: err => {
          console.log(err)
        }
      })
  }

  get400ValidationError() {
    this.http.post(this.baseUrl.concat('accounts/register'),{})
      .subscribe({
        next : response => console.log(response),
        error: err => {
          this.validationErrors = err;
          console.log(  this.validationErrors)
        }
      })
  }
}
