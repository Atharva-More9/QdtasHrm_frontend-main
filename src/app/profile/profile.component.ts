import { Component, HostListener, OnInit } from '@angular/core';
import { UserService } from '../service/userServices';
import { User } from '../model/user';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  isSidebarExpanded: boolean = true;


  constructor(private userService: UserService) {
  }

  ngOnInit() {
    this.userService.profile();
  }


  onToggleSidebar(expanded: boolean) {
    this.isSidebarExpanded = expanded;
  }

}


