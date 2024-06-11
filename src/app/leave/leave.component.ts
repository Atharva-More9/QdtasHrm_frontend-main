import { Component } from '@angular/core';
import { UserService } from '../service/userServices';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogboxComponent } from '../dialogbox/dialogbox.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar'
import { User } from '../model/user';
import { Leave } from '../model/leave';
import { Subscription } from 'rxjs';
import { OnInit, ViewChild } from '@angular/core';
import {NativeDateAdapter} from '@angular/material/core';
import { FormControl } from '@angular/forms';
import { MatDatepickerInput } from '@angular/material/datepicker';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';


@Component({
  selector: 'app-leave',
  templateUrl: './leave.component.html',
  styleUrls: ['./leave.component.css'],

})
export class LeaveComponent {
  displayedColumns: string[] = ['employee', 'startDate', 'endDate', 'type','reason','status','actions'];
  dataSource: MatTableDataSource<Leave>;



  constructor(private UserService: UserService,
    public dialog: MatDialog,
     private snackBar: MatSnackBar ) {

       const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 7);
    this.minDate = currentDate;
    this.dataSource = new MatTableDataSource<Leave>();
  }


  minDate : Date;
  startDate!: Date;


  sideNavStatus: boolean = false;
  u: User = this.UserService.getAuthUserFromCache();
  empId: number = this.UserService.getAuthUserId();
  leaves: Leave[] = [];
  resultPage: number = 1;
  resultSize: number = 10;
  hasMoreResult: boolean = true;
  fetchingResult: boolean = false;
  private subscriptions: Subscription[] = [];



   successMessage: string | null = null;
  errorMessage: string | null = null;



  ngOnInit() {
    this.UserService.profile();
    this.empId = this.UserService.getAuthUserId();
    this.loadLeaves(this.resultPage);
}

  isSidebarExpanded: boolean = true;
  isLoading: boolean = false;

  onToggleSidebar(expanded: boolean) {
    this.isSidebarExpanded = expanded;
  }

  applyLeave(userData: any) {
    console.log(userData);
    this.UserService.applyLeave(userData, this.empId).subscribe(
      (response: any) => {
        this.successMessage = 'Leave Applied Successfully';
      setTimeout(() => {
        this.successMessage = null;
	window.location.reload();
      }, 3000);
      },
      (error: any) => {
        this.errorMessage = 'Something went wrong';
      setTimeout(() => {
        this.errorMessage = null;
      }, 3000);
      }
    );
  }



  loadLeaves(currentPage: number) {
       this.subscriptions.push(
      this.UserService.getAllLeaves(currentPage, this.resultSize).subscribe(
        (l: Leave[]) => {
          this.leaves.push(...l);
          this.dataSource.data = this.leaves;
          if (this.leaves.length <= 0 && this.resultPage === 1)
            if (this.leaves.length <= 0) this.hasMoreResult = false;
          this.fetchingResult = false;
          this.resultPage++;
        }, (error) => {
          console.log(error.error.message);
        }
      )
    );
  }


  loadMoreleaves(): void {
    this.isLoading = true;
    this.loadLeaves(this.resultPage);
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }



  //Reject leave <----
  rejectLeave(id: number): void {
    this.openConfirmationDialog(id);
  }


  openConfirmationDialog(index: number): void {
    const dialogRef = this.dialog.open(DialogboxComponent, {
      width: '300px',
      data: { title: 'Confirmation', message: 'Are you sure you want to reject this leave?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.UserService.changeLeaveStatus(index).subscribe(
          (response: any) => {
           this.successMessage = 'Leave Rejected';
      setTimeout(() => {
        this.successMessage = null;
	window.location.reload();
      }, 3000);
          },
          (error: any) => {
            this.errorMessage = 'Something went wrong';
      setTimeout(() => {
        this.errorMessage = null;
      }, 3000);
          }
        );

      }
    });
  }

  //------->

leaveApprovalStatus: { [key: number]: boolean } = {};

  //Approve Leave <-----------
   approveLeave(id: number): void {
    this.openConfirmDialog(id);
  }


  openConfirmDialog(index: number): void {
    const dialogRef = this.dialog.open(DialogboxComponent, {
      width: '300px',
      data: { title: 'Confirmation', message: 'Are you sure you want to Approve this leave?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.UserService.changeLeaveStatusApprove(index).subscribe(
          (response: any) => {
           this.successMessage = 'Leave Accepted';
      setTimeout(() => {
        this.successMessage = null;
	window.location.reload();
      }, 3000);

          },
          (error: any) => {
            this.errorMessage = 'Something went wrong';
      setTimeout(() => {
        this.errorMessage = null;
      }, 3000);
          }
        );

      }
    });
  }


  //-------
//delete leave

deleteLeave(id:number) {
   this.openConfirmDialogforDelete(id);
}


  openConfirmDialogforDelete(index: number): void {
    const dialogRef = this.dialog.open(DialogboxComponent, {
      width: '300px',
      data: { title: 'Confirmation', message: 'Are you sure you want to Delete this leave?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.UserService.deleteLeave(index).subscribe(
          (response: any) => {
           this.successMessage = 'Leave Deleted';
      setTimeout(() => {
        this.successMessage = null;
	window.location.reload();
      }, 3000);
          },
          (error: any) => {
            this.errorMessage = 'Something went wrong';
      setTimeout(() => {
        this.errorMessage = null;
      }, 3000);
          }
        );

      }
    });
  }



  dismissSuccessMessage() {
    this.successMessage = null;
}

dismissErrorMessage() {
   this.errorMessage = null;
}

// preventManualInput(event: KeyboardEvent) {
//     event.preventDefault();
// }


getStatusColor(status: string): string {
  switch (status) {
    case 'REJECTED':
      return '#EE4B2B';
    case 'APPROVED':
      return '#32CD32';
    case 'PENDING':
      return '#fffee0';
    default:
      return 'black'; // or any default color
  }
}






}
