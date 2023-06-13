import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { IMember } from 'src/app/interfaces/IMember';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {

  @Input() member: IMember | undefined;
  constructor() { }

  ngOnInit(): void {
  }

}
