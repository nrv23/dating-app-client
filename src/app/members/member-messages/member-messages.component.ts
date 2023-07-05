import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService } from 'src/app/_services/message.service';
import { IMessage } from 'src/app/interfaces/IMessage';


@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {

  @ViewChild('messageForm') messageForm?: NgForm;
  @Input() username?: string;
  @Input() messages: IMessage[] = [];
  messageContent: string = '';

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {

  }

  sendMessage(e: Event) {

    e.preventDefault();

    if (!this.username || !this.messageContent) return;

    this.messageService.sendMessage(this.username, this.messageContent)
      .subscribe({
        next: messageResponse => {
          this.messages.push(messageResponse);
          this.messageForm?.reset();
        }
      })
  }
}
