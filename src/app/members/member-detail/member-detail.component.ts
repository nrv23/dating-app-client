import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { MemberService } from 'src/app/_services/member.service';
import { IMember } from 'src/app/interfaces/IMember';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {

  member: IMember | undefined;
  galleryOptions: NgxGalleryOptions[] = [];
  galleryImages: NgxGalleryImage[] = []

  constructor(private memberServce: MemberService, private route: ActivatedRoute) { }


  getMemberByUsername(username: string) {
    this.memberServce.getMemberByUsername(username).subscribe({
      next: response => {
        this.member = response;
        this.galleryImages = this.getImages();
      },
      error: err => console.log(err)
    })
  }

  getImages() {
    if(!this.member) return [];
    const imageUrls = [];
    console.log(this.member)
    for (const photo of this.member.photos) {
      console.log(photo);
      imageUrls.push({
        small: photo.url,
        medium: photo.url,
        big: photo.url,
      })
    }

    return imageUrls;
  }

  ngOnInit(): void {

    this.route.params.subscribe({
      next: (response)  => {

        this.galleryOptions = [
          {
            width:"500px",
            height:"500px",
            imagePercent: 100,
            thumbnailsColumns: 4,
            imageAnimation: NgxGalleryAnimation.Slide,
            preview: false
          }
        ]
        this.getMemberByUsername(response["username"]);
        
      },
      error: err => {
        console.log(err)
      }
    })
  }  
}
