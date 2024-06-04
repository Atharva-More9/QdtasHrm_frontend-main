import { Component , OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../service/userServices';
import { Time } from '../model/time';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';

@Component({
  selector: 'app-time-sheet-data',
  templateUrl: './time-sheet-data.component.html',
  styleUrls: ['./time-sheet-data.component.css']
})
export class TimeSheetDataComponent {
  displayedColumns: string[] = ['date', 'startTime', 'endTime', 'note',];
  dataSource: MatTableDataSource<Time>;
    sideNavStatus: boolean = false;
    isSidebarExpanded: boolean = true;
   

    onToggleSidebar(expanded: boolean) {
    this.isSidebarExpanded = expanded;
  }

  constructor(private route: ActivatedRoute,
    private userService: UserService,    )
    {
      this.dataSource = new MatTableDataSource();
    }

  private subscriptions: Subscription[] = [];
  timeSheets: Time[] = [];
  resultPage: number = 1;
  resultSize: number = 30;
  hasMoreResult: boolean = true;
  fetchingResult: boolean = false;
  isLoading: boolean = false; 
  noResultMessage : string = '';
  eId: Number = 0;

  ngOnInit() {
    this.timeSheets.splice(0, this.timeSheets.length);
    this.route.paramMap.subscribe(params => {
      this.eId = parseInt(params.get ('eId') as string);
      console.log(this.eId);
      this.loadTimeSheet(this.resultPage, this.resultSize , this.eId);
    });
  }
    loadTimeSheet(currentPage: Number , resultSize: Number, eId: Number) {
      this.isLoading = true;
      this.subscriptions.push(
      this.userService.getTimeSheetByEmpId(currentPage ,resultSize , eId).subscribe(
        (t: Time[]) => {
          this.timeSheets.push(...t);
          this.dataSource.data =this.timeSheets;
          this.isLoading = false;
          if (this.timeSheets.length <= 0 && this.resultPage === 1) {
            this.hasMoreResult = false;
            this.noResultMessage = "No result found."
          }
          this.fetchingResult = false;
          this.resultPage++;
        }, (error) => {
          console.log(error);
        }
      )
    );
  }

  loadMoreTimeSheet(): void {
    this.isLoading = true;
    this.loadTimeSheet(this.resultPage, this.resultSize ,  this.eId);
    setTimeout(() => {
       this.isLoading = false;
    }, 1000);
  }

}


