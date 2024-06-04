import { Component } from '@angular/core';
import { UserService } from '../service/userServices';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private userService: UserService, private router: Router, private snackBar: MatSnackBar) {
  }

  isLoading: boolean = false; 
  showMessage: boolean = false;
  message: string = '';




  userLogin(data: any) {
    this.isLoading = true;
    this.showMessage = false;
    this.userService.login(data).subscribe(
      (response: any) => {
        localStorage.setItem("token", response.token);
        this.userService.storeAuthUserInCache(response.user);
        this.router.navigate(['/profile']);
        this.isLoading = false;
      }, (error: HttpErrorResponse) => {
        this.isLoading = false;
        if (error.status == 401) {
          this.message = "Invalid email or password. Please try again.";
          this.showMessage = true;
        }
        else if (error.status == 400) {
          this.message = "Something went wrong with your request. Please try again later. Error: " + error.error.message;
          this.showMessage = true;
        }
        else {
          this.message = "An unexpected error occurred. Please try again later. Error: " + error.error.message;
          this.showMessage = true;
        }
      }
    )
  }

  showSnackBar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      verticalPosition: 'top' // 5 seconds
    });
  }


}
