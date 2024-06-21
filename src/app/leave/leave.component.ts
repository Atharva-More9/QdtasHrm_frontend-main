import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { Leave } from '../model/leave';
import { UserService } from '../service/userServices';
import { DialogboxComponent } from '../dialogbox/dialogbox.component';
import { MatTableDataSource } from "@angular/material/table";

import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-leave',
  templateUrl: './leave.component.html',
  styleUrls: ['./leave.component.css'],
})
export class LeaveComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['employee', 'startDate', 'endDate', 'type', 'reason', 'status', 'actions'];
  dataSource: MatTableDataSource<Leave>;

  minDate: Date;
  startDate!: Date;

  empId!: number;
  leaves: Leave[] = [];
  resultPage: number = 1;
  resultSize: number = 10;
  hasMoreResult: boolean = true;
  fetchingResult: boolean = false;
  private subscriptions: Subscription[] = [];

  successMessage: string | null = null;
  errorMessage: string | null = null;

  isFormValid: boolean = false;

  isSidebarExpanded: boolean = true;
  isLoading: boolean = false;

  hasApprovedLeave: boolean = false;

  constructor(
    private userService: UserService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe
  ) {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 7);
    this.minDate = currentDate;
    this.dataSource = new MatTableDataSource<Leave>();
  }

  ngOnInit() {
    this.userService.profile();
    this.empId = this.userService.getAuthUserId();
    this.loadLeaves(this.resultPage);
  }

  ngOnDestroy() {
    // Unsubscribe from all subscriptions to prevent memory leaks
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  onToggleSidebar(expanded: boolean) {
    this.isSidebarExpanded = expanded;
  }

  loadLeaves(currentPage: number) {
    this.subscriptions.push(
      this.userService.getAllLeaves(currentPage, this.resultSize).subscribe(
        (l: Leave[]) => {
          this.leaves.push(...l);
          this.dataSource.data = this.leaves;
          if (this.leaves.length <= 0 && this.resultPage === 1) {
            this.hasMoreResult = false;
          }
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

  rejectLeave(id: number): void {
    this.openConfirmationDialog(id);
  }

  openConfirmationDialog(index: number): void {
    const dialogRef = this.dialog.open(DialogboxComponent, {
      width: '300px',
      data: {title: 'Confirmation', message: 'Are you sure you want to reject this leave?'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.changeLeaveStatus(index).subscribe(
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

  approveLeave(id: number): void {
    this.openConfirmDialog(id);
  }

  openConfirmDialog(index: number): void {
    const dialogRef = this.dialog.open(DialogboxComponent, {
      width: '300px',
      data: {title: 'Confirmation', message: 'Are you sure you want to Approve this leave?'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.changeLeaveStatusApprove(index).subscribe(
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

  deleteLeave(id: number) {
    this.openConfirmDialogforDelete(id);
  }

  openConfirmDialogforDelete(index: number): void {
    const dialogRef = this.dialog.open(DialogboxComponent, {
      width: '300px',
      data: {title: 'Confirmation', message: 'Are you sure you want to Delete this leave?'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.deleteLeave(index).subscribe(
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

  getStatusColor(status: string): string {
    switch (status) {
      case 'REJECTED':
        return '#EE4B2B';
      case 'APPROVED':
        return '#32CD32';
      case 'PENDING':
        return '#fffee0';
      default:
        return 'black';
    }
  }

  applyLeave(leaveData: any) {
    const empId = this.userService.getAuthUserId();

    const newStartDate = new Date(leaveData.startDate);
    const newEndDate = new Date(leaveData.endDate);

    // Format the start date
    const formattedStartDate = this.datePipe.transform(leaveData.startDate, 'yyyy/MM/dd');
    // Format the end date
    const formattedEndDate = this.datePipe.transform(leaveData.endDate, 'yyyy/MM/dd');

    const formData = {
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      type: leaveData.type,
      reason: leaveData.reason
    };

    //console.log(formData);

    // Fetch existing approved leave records for the current employee
    this.userService.getAllLeaves(1, 1000).subscribe(
      (leaves: Leave[]) => {
        // Check for overlapping leave dates with existing approved leave records for the current employee
        const overlappingLeave = leaves.find(leave => {
          const leaveStartDate = new Date(leave.startDate);
          const leaveEndDate = new Date(leave.endDate);

          // Check for complete overlap
          const isCompleteOverlap = (newStartDate <= leaveEndDate && newEndDate >= leaveStartDate);

          // Check for partial overlap
          const isPartialOverlap = (
            (newStartDate <= leaveEndDate && newStartDate >= leaveStartDate) ||
            (newEndDate >= leaveStartDate && newEndDate <= leaveEndDate)
          );

          return isCompleteOverlap || isPartialOverlap;
        });

        // If overlap detected, display error message and return
        if (overlappingLeave) {
          this.errorMessage = 'Leave cannot be applied for overlapping dates';
          setTimeout(() => {
            this.errorMessage = null;
          }, 3000);
          return;
        }

        // If no overlap, proceed with applying leave
        this.userService.applyLeave(formData, empId).subscribe(
          (response: any) => {
            console.log('Leave request submitted successfully:', response);
            this.leaves.push(response);
            this.dataSource.data = this.leaves;
            this.successMessage = 'Leave request submitted successfully';
            setTimeout(() => {
              this.successMessage = null;
            }, 3000);
          },
          (error: any) => {
            console.error('Error submitting leave request:', error);
            this.errorMessage = 'Error submitting leave request';
            setTimeout(() => {
              this.errorMessage = null;
            }, 3000);
          }
        );
      },
      (error: any) => {
        console.error('Error fetching leaves:', error);
        this.errorMessage = 'Error fetching leaves';
        setTimeout(() => {
          this.errorMessage = null;
        }, 3000);
      }
    );
  }

}
