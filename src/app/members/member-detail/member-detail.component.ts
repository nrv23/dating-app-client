import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { take } from 'rxjs';
import { AccountService } from 'src/app/_services/account.service';
import { MemberService } from 'src/app/_services/member.service';
import { MessageService } from 'src/app/_services/message.service';
import { PresenceService } from 'src/app/_services/presence.service';
import { IMember } from 'src/app/interfaces/IMember';
import { IMessage } from 'src/app/interfaces/IMessage';
import { IUserResponse } from 'src/app/interfaces/IUserResponse';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit, OnDestroy {

  @ViewChild('memberTabs', { static: true }) memberTabs?: TabsetComponent;
  member: IMember = {} as IMember;
  galleryOptions: NgxGalleryOptions[] = [];
  galleryImages: NgxGalleryImage[] = [];
  activeTab?: TabDirective;
  messages?: IMessage[];
  user?: IUserResponse;

  constructor(
      private accountService: AccountService, 
      private route: ActivatedRoute, 
      private messageService: MessageService,
      public presenceService: PresenceService) {
        this.accountService.currentUserSource$.pipe(take(1)).subscribe({
          next: user => {
            if(user) this.user = user;
          }
        })
   }
  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  }


  /*getMemberByUsername(username: string) {
    this.memberServce.getMemberByUsername(username).subscribe({
      next: response => {
        this.member = response;
        console.log(response)
        this.galleryImages = this.getImages();
      },
      error: err => console.log(err)
    })
  }*/

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
    if (this.user && this.activeTab.heading === 'Messages' && !this.messages?.length) {
      // cargar los mensajes de la conversacion
      this.messageService.createHubConnection(this.user, this.member.userName);
    } else {
      this.messageService.stopHubConnection();
    }
  }

  selectTab(heading: string) {
    if (this.memberTabs) {
      this.memberTabs.tabs.find(x => x.heading === heading)!.active = true;
    } else {
      this.messageService
    }
  }
}
