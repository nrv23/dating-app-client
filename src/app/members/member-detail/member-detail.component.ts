import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { MemberService } from 'src/app/_services/member.service';
import { MessageService } from 'src/app/_services/message.service';
import { IMember } from 'src/app/interfaces/IMember';
import { IMessage } from 'src/app/interfaces/IMessage';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {

  @ViewChild('memberTabs', { static: true }) memberTabs?: TabsetComponent;
  member: IMember = {} as IMember;
  galleryOptions: NgxGalleryOptions[] = [];
  galleryImages: NgxGalleryImage[] = [];
  activeTab?: TabDirective;
  messages?: IMessage[];

  constructor(private memberServce: MemberService, private route: ActivatedRoute, private messageService: MessageService) {
    
   }


  getMemberByUsername(username: string) {
    this.memberServce.getMemberByUsername(username).subscribe({
      next: response => {
        this.member = response;
        console.log(response)
        this.galleryImages = this.getImages();
      },
      error: err => console.log(err)
    })
  }

  getImages() {
    if (!this.member) return [];
    const imageUrls = [];

    for (const photo of this.member.photos) {

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
      next: (params) => {
        this.galleryOptions = [
          {
            width: "500px",
            height: "500px",
            imagePercent: 100,
            thumbnailsColumns: 4,
            imageAnimation: NgxGalleryAnimation.Slide,
            preview: false
          }
        ]

        this.route.data.subscribe({
          next: response => {
            this.member = response['member'];
            this.galleryImages = this.getImages();
          }
        }); 

        //this.getMemberByUsername(params["username"]);
      },
      error: err => {
        console.log(err)
      }
    })

    this.route.queryParams.subscribe({
      next: params => {
        params['tab'] && this.selectTab(params['tab']);
      }
    })

   

    this.galleryImages = this.getImages();
  }

  loadMessages() {
    
    this.messageService.getMessageThread(this.member?.userName!)
      .subscribe({
        next: response => {
          this.messages = response;
        }
      })
  }

  onTabActivated(data: TabDirective) {

    this.activeTab = data;
    // comprobar si el tab que se esta activando es el de mensajes y entonces ahi cargar los mensajes 
    if (this.activeTab.heading === 'Messages' && !this.messages?.length) {
      // cargar los mensajes de la conversacion
      this.loadMessages();
    }
  }

  selectTab(heading: string) {
    if (this.memberTabs) {
      this.memberTabs.tabs.find(x => x.heading === heading)!.active = true;
    }
  }
}
