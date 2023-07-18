import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { AdminService } from 'src/app/_services/admin.service';
import { User } from 'src/app/interfaces/IUser';
import { RolesModalComponent } from 'src/app/modals/roles-modal/roles-modal.component';


@Component({
  selector: 'app-user-managment',
  templateUrl: './user-managment.component.html',
  styleUrls: ['./user-managment.component.css']
})
export class UserManagmentComponent implements OnInit {

  users: User[] = [];
  bsModalRef: BsModalRef<RolesModalComponent> = new BsModalRef<RolesModalComponent>();
  availableRoles: string[] = [
    'Admin',
    'Moderator',
    'Member'
  ];

  constructor(private adminService: AdminService, private modalService: BsModalService) { }

  ngOnInit(): void {
    this.getUsersWithRoles();
  }

  getUsersWithRoles() {
    this.adminService.getUsersWithRoles()
      .subscribe({
        next: users => {
          this.users = users;
        }
      });
  }

  openRolesModal(user: User) {

    const config: ModalOptions = { // esta configuracion se envia al componente RolesModal y lee esos valores como propiedades de la clase
      class: 'modal-dialog-centered',
      initialState: { // este intiial state es lo que el componente lee como propiedades y deben llamarse como las propiedades del intial state
        username: user.userName,
        availableRoles: this.availableRoles,
        selectedRoles: [...user.roles]
      }
    }
    this.bsModalRef = this.modalService.show(RolesModalComponent, config);
    //this.bsModalRef.content!.closeBtnName = 'Close';
    this.bsModalRef.onHide?.subscribe({
      next: () => {
        const selectedRoles = this.bsModalRef.content?.selectedRoles;
        // saber si se cambiaron los roles 
        if (!this.arrayEqual(selectedRoles!, user.roles)) {
          this.adminService.updateUserRoles(user.userName, selectedRoles!)
            .subscribe({
              next: roles => user.roles = roles
            })
        }
      }
    })
  }

  private arrayEqual(arr1: any[], arr2: any[]) {
    return JSON.stringify(arr1.sort()) === JSON.stringify(arr2.sort());
  }

}
