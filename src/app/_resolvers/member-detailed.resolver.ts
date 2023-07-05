import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { MemberService } from '../_services/member.service';
import { IMember } from '../interfaces/IMember';

@Injectable({
  providedIn: 'root'
})
export class MemberDetailedResolver implements Resolve<IMember> {
  constructor(private memberService:MemberService){

  }
  resolve(route: ActivatedRouteSnapshot): Observable<IMember> {
    return this.memberService.getMemberByUsername(route.paramMap.get('username')!)
  }
}
