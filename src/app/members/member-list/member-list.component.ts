import { Component, OnInit } from '@angular/core';
import { Observable, map, take } from 'rxjs';
import { AccountService } from 'src/app/_services/account.service';
import { MemberService } from 'src/app/_services/member.service';
import { IGender } from 'src/app/interfaces/IGender';
import { IMember } from 'src/app/interfaces/IMember';
import { IPagation } from 'src/app/interfaces/IPagination';
import { IUserResponse } from 'src/app/interfaces/IUserResponse';
import { UserParams } from 'src/app/models/IUserParams';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {

  MembersList$: Observable<IMember[]> | undefined;
  pagination: IPagation | undefined;
  members: IMember[] = [];
  userParams: UserParams | undefined;
  genderList: IGender[] | undefined;

  constructor(private memberService: MemberService) {
    this.genderList = [
      { value: "male", display: "males" },
      { value: "female", display: "females" }
    ]

    this.userParams = this.memberService.getUserParams();
  }

  ngOnInit(): void {
    this.loadMembers();
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

  loadMembers() {
    if (this.userParams) {
      this.memberService.setUserParams(this.userParams);
      this.memberService.getMembers(this.userParams)
        .subscribe({
          next: response => {
            this.members = response.result!;
            this.pagination = response.pagination;
          },
          error: err => {

          }
        })
    }
  }

  pageChanged(e: any) {
    if (!this.userParams) return;
    if (this.userParams.pageNumber !== e.page) {
      this.userParams.pageNumber = e.page;
      this.memberService.setUserParams(this.userParams);
      this.loadMembers();
    }
  }

  resetFilters() {
    this.userParams = this.memberService.resetUserParams();
    this.loadMembers();
  }
}
