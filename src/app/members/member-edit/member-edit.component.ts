
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { AccountService } from 'src/app/_services/account.service';
import { MemberService } from 'src/app/_services/member.service';
import { IMember } from 'src/app/interfaces/IMember';
import { IUserResponse } from 'src/app/interfaces/IUserResponse';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  member: IMember | undefined;
  user: IUserResponse | null = null;
  @ViewChild("editForm") editForm: NgForm | undefined; 
  @HostListener("window:beforeunload",["$event"]) unloadNotification($event: any) {
    if(this.editForm?.dirty){
      $event.returnValue = true;
    }
  }
  /*
    viewChild indica que el componente html es hijo del componente ts, por lo tanto con el view child el componente ts tiene 
    acceso a las propiedades del componente html y el parametro que se le pasa al ViewChild es el nombre del elemento html.

    Pero ese nombre se asgina con el ngForm
  */

  constructor(private accountService: AccountService, private memberService: MemberService, private toastrService: ToastrService) {

    this.accountService.currentUserSource$.pipe(take(1))
      .subscribe({
        next: user => this.user = user,
        error: err => {
          console.log(err);
        }
      })
  }

  getMemberByUsername() {
    if (this.user) {
      this.memberService.getMemberByUsername(this.user.username).subscribe({
        next: member => {
          this.member = member;
        },
        error: err => console.log(err)
      })
    }

    return;
  }

  ngOnInit(): void {
    this.getMemberByUsername();

  }

  updateMember(e: Event) {
    e.preventDefault();
    

    this.memberService.updateUser(this.editForm!.value).subscribe(
      {
        next: () => {
          this.toastrService.success("Perfil actualizado con exito");
          this.editForm!.reset(this.member); // resetear el formulario pero con los datos actualizados de la propiedad member
        },
        error: err => console.log(err) 
      }
    )
  }
}
