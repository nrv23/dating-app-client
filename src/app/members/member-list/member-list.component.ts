import { Component, OnInit } from '@angular/core';
import { MemberService } from 'src/app/_services/member.service';
import { IMember } from 'src/app/interfaces/IMember';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {

  MembersList!: IMember[];

  constructor(private memberService: MemberService) { }

  ngOnInit(): void {

    this.getMembers()
  }

  getMembers() {

    this.memberService.getMembers()
      .subscribe({
        next: response => {
          this.MembersList = response;
        },
        error: err => {
          console.error(err)
        },
        complete: () => {

        }
      })
  }

  getMemberByUsername(username: string) {
    this.memberService.getMemberByUsername(username)
      .subscribe({
        next: response => {
          console.log(response);
        },
        error: err => {
          console.error(err)
        },
        complete: () => {

        }
      })
  }

}
