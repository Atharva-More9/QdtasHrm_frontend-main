import { Component } from '@angular/core';
import { UserService } from '../service/userServices';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  constructor(private userService: UserService) { }

  onSubmit(res: FormData) {
    const J = JSON.parse(JSON.stringify(res));
    console.log(J.email);
    this.userService.resetPassword(J.email).subscribe(
      (data: any) => {
        alert(data.message);
      },
      (error: any) => {
        alert(error.error.message);
      }

    );
  }


}
