import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MemberService } from 'src/app/_services/member.service';
import { PresenceService } from 'src/app/_services/presence.service';
import { IMember } from 'src/app/interfaces/IMember';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {

  @Input() member: IMember | undefined;
  constructor(private memberService: MemberService, private toastr: ToastrService, public presenceService: PresenceService) { }

  ngOnInit(): void {
  }

  addLike(member: IMember) {
    this.memberService.addLike(member.userName).subscribe({
      next: _ => {
        this.toastr.success('You have liked ' + member.knownAs);
      }
    })
  }
}
