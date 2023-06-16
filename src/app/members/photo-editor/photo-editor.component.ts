import { Component, Input, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { take } from 'rxjs';
import { AccountService } from 'src/app/_services/account.service';
import { IMember } from 'src/app/interfaces/IMember';
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

  constructor(private accountService: AccountService) {
    this.accountService.currentUserSource$.pipe(take(1))
      .subscribe({
        next: user => {
          if(user) this.user = user;
        }
      });
   }

   fileOverBase(e: any) {
    this.hasBaseDropZoneOver = e;
   }

   initializeUploade() {
    this.uploader = new FileUploader({
      url: this.baseUrl+'/users/add-photo',
      authToken: 'Bearer '+this.user?.token,
      isHTML5: true,
      allowedFileType: ["image"],
      removeAfterUpload: true, // se borra la instancia de la imagen uina vez que se sube
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });

    this.uploader.onAfterAddingFile = file => {
      file.withCredentials = false;
    }

    this.uploader.onSuccessItem = (item,response, status,headers) => {
      if( response) {
        const photo = JSON.parse(response);
        this.member?.photos.push(photo);
      }
    }
   }

  ngOnInit(): void {
    this.initializeUploade();
  }

}
