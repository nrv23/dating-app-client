import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-roles-modal',
  templateUrl: './roles-modal.component.html',
  styleUrls: ['./roles-modal.component.css']
})
export class RolesModalComponent implements OnInit {
  username= '';
  availableRoles: any[] = [];
  selectedRoles: any[] = [];
  closeBtnName = '';

  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit(): void {
  }

  updateChecked(checkedvalue: string) {
      const index = this.selectedRoles.indexOf(checkedvalue);
      //comparar si el role existe lo elimina sino lo agrega
      index !== -1 ? this.selectedRoles.splice(index,1):this.selectedRoles.push(checkedvalue);
  }

}
