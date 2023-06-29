import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getApiUrl } from '../utils/Api';
import { 
  getPaginatedResults,
  getPaginationHeaders
} from '../helpers/PaginationHelper';

@Injectable({
  providedIn: 'root'
})
export class MessageService {


  baseUrl = getApiUrl();

  constructor(private http: HttpClient) { 
  }


  getMessages(pageNumber: number, pageSize: number, container: string) {

  }

}
