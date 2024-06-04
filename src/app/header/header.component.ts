import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../service/userServices';
import { User } from '../model/user';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent  implements OnInit{

   @Output() toggleSidebarForMe: EventEmitter<any> = new EventEmitter();

constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {}

  @Output() sidebarCollapsed = new EventEmitter<boolean>();
  isCollapsed: boolean = false;

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
    this.sidebarCollapsed.emit(this.isCollapsed);
  }

  isLoggedIn() {
    const token = localStorage.getItem("token");
    if (token == null || token.length <= 0 ) {
      return false;
    } else {
      return true;
    }
  }


  logout() {
    this.userService.clearc(); 
    this.router.navigate(['/']); 
  }


}
