import { Component, Input, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { AccountService } from 'src/app/_services/account.service';
import { MemberService } from 'src/app/_services/member.service';
import { IMember } from 'src/app/interfaces/IMember';
import { Photo } from 'src/app/interfaces/IPhoto';
import { IUserResponse } from 'src/app/interfaces/IUserResponse';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {

  @Input() member: IMember | undefined;
  uploader: FileUploader | undefined;
  hasBaseDropZoneOver = false;
  baseUrl = environment.baseUrl;
  user: IUserResponse | undefined;

  constructor(private accountService: AccountService, private memberService: MemberService, private toastr: ToastrService) {
    this.accountService.currentUserSource$.pipe(take(1))
      .subscribe({
        next: user => {
          if (user) this.user = user;
        }
      });
  }

  fileOverBase(e: any) {
    this.hasBaseDropZoneOver = e;
  }

  initializeUploade() {
    this.uploader = new FileUploader({
      url: this.baseUrl + '/users/add-photo',
      authToken: 'Bearer ' + this.user?.token,
      isHTML5: true,
      allowedFileType: ["image"],
      removeAfterUpload: true, // se borra la instancia de la imagen uina vez que se sube
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });

    this.uploader.onAfterAddingFile = file => {
      file.withCredentials = false;
    }

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const photo = JSON.parse(response);
        this.member?.photos.push(photo);

        if(photo.isMain && this.user && this.member) {
          this.user.photoUrl = photo.url;
          this.member.photoUrl = photo.url;
          this.accountService.setCurrentUser(this.user);
        }
      }
    }
  }

  setMainPhoto(photo: Photo) {
    this.memberService.setMainPhoto(photo.id)
      .subscribe({
        next: response => {

          if (this.user && this.member) {
            this.user.photoUrl = photo.url;
            this.accountService.setCurrentUser(this.user);
            this.member.photoUrl = photo.url;
            this.toastr.success(response, "Set Main Photo");
            this.member.photos.forEach(p => {
              if(p.isMain) p.isMain = false;
              if(p.id === photo.id) p.isMain = true;
            })
          }
        }
      })
  }

  deletePhoto(photo: Photo) {
    this.memberService.deletePhoto(photo.id)
      .subscribe({
        next: response => {
          this.member!.photos =  this.member!.photos.filter(x => x.id !== photo.id);
          this.toastr.success(response, "Delete Photo");
        }
      })
  }

  ngOnInit(): void {
    this.initializeUploade();
  }

}
