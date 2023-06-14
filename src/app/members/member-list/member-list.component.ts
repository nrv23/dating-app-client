import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MemberService } from 'src/app/_services/member.service';
import { IMember } from 'src/app/interfaces/IMember';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {

  MembersList$: Observable<IMember[]> | undefined;

  constructor(private memberService: MemberService) { }

  ngOnInit(): void {
    this.MembersList$ = this.memberService.getMembers();
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
