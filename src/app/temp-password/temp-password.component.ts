import { Component } from '@angular/core';
import { UserService } from '../service/userServices';
import { Router } from '@angular/router';

@Component({
  selector: 'app-temp-password',
  templateUrl: './temp-password.component.html',
  styleUrls: ['./temp-password.component.css']
})
export class TempPasswordComponent {
  constructor(private userService: UserService, private router: Router) { }

  changeTempPass(cp: any) {
    console.log(cp);

    this.userService.changeTempPass(cp).subscribe(
      (response: any) => {
        alert(response.message);
        window.location.reload();
      },
      (error: any) => {
        alert(error.message);
      }
    );

  }

}
