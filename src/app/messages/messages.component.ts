import { Component, OnInit } from '@angular/core';
import { MessageService } from '../_services/message.service';
import { IMessage } from '../interfaces/IMessage';
import { IPagation, PaginatedResults } from '../interfaces/IPagination';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  constructor(private messageService: MessageService) { }
  messages?: IMessage[];
  pagination?: IPagation;
  container = "Unread";
  pageNumber = 1;
  pageSize = 5;
  loading = false;

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages() {
    this.loading = true;
    this.messageService.getMessages(this.pageNumber, this.pageSize, this.container)
      .subscribe({
        next: response => { 
          this.loading = false;
          if (response) {
            this.messages = response.result;
            this.pagination = response.pagination;
    
          }
        },
        error : () => this.loading = false
      })
  }

  deleteMessage(id: number) {
    this.messageService.deleteMessage(id).subscribe(() => {
      this.messages?.splice(this.messages.findIndex(m => m.id === id), 1);
    })
  }

  pageChanged(e: any) {
    if (this.pageNumber !== e.page) {
      this.pageNumber = e.page;
      this.loadMessages();
    }
  }

}
