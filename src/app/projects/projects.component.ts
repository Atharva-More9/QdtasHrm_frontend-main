import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../model/user';
import { UserService } from '../service/userServices';
import { Subscription } from 'rxjs';
import { Project } from '../model/project';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit, OnDestroy {
  isSidebarExpanded: boolean = true;
  users: User[] = [];
  resultSizeForUser = 1000;
  resultSize = 10;
  resultPage: number = 1;
  hasMoreResult: boolean = true;
  fetchingResult: boolean = false;
  noResultMessage: string = '';
  empId: number = this.userService.getAuthUserId();
  eId: number = 0;
  selectedTeams: any[] = [];
  selectedManagers: any[] = [];
  private subscriptions: Subscription[] = [];
  fullName: any[] = [];
  successMessage: string | null = null;
  errorMessage: string | null = null;
  projects: Project[] = [];
  isLoading: boolean = false;
  isLoggedIn!: User;
  displayedColumns: string[] = ['projectId','projectName', 'client', 'teams', 'managers', 'status', 'actions'];
  dataSource: MatTableDataSource<Project>;

  dropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'firstName',
    selectAllText: 'Select All',
    unSelectAllText: 'Unselect All',
    itemsShowLimit: 3,
    allowSearchFilter: true
  };

  dropdownSettingsForManagers = {
    singleSelection: false,
    idField: 'id',
    textField: 'firstName',
    selectAllText: 'Select All',
    unSelectAllText: 'Unselect All',
    itemsShowLimit: 3,
    allowSearchFilter: true
  };

  constructor(private userService: UserService, private router: Router) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
    this.loadUsers(1);
    this.isLoggedIn = this.userService.getAuthUserFromCache();
    this.eId = this.userService.getAuthUserId();
    this.loadProjects(this.resultPage, this.resultSize);
    this.userService.profile();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  onToggleSidebar(expanded: boolean) {
    this.isSidebarExpanded = expanded;
  }

  loadUsers(selectedPage: number): void {
    this.loadUsernames(selectedPage);
  }

  loadUsernames(selectedPage: number): void {
    this.subscriptions.push(
      this.userService.getAllUsers(selectedPage, this.resultSizeForUser).subscribe(
        (users: User[]) => {
          this.users = users;
          this.fullName = this.users
            .map(user => user.firstName + ' ' + user.lastName)
            .filter(name => !!name);
        },
        (error) => {
          console.log(error.error.message);
        }
      )
    );
  }

  addProjectData(projectData: any) {
    this.userService.addProject(projectData).subscribe(
      (response: any) => {
        this.successMessage = 'Project added Successfully';
        setTimeout(() => {
          this.successMessage = null;
          window.location.reload();
        }, 3000);
      },
      (error: any) => {
        this.errorMessage = 'An error occurred while adding the project';
        setTimeout(() => {
          this.errorMessage = null;
        }, 3000);
      }
    );
  }

  dismissSuccessMessage() {
    this.successMessage = null;
  }

  dismissErrorMessage() {
    this.errorMessage = null;
  }

  loadProjects(currentPage: number, resultSize: number) {
    this.isLoading = true;
    this.subscriptions.push(
      this.userService.getAllProjects(currentPage, resultSize).subscribe(
        (projects: Project[]) => {
          this.projects.push(...projects);
          this.dataSource.data = this.projects;
          this.isLoading = false;
          if (this.projects.length === 0 && this.resultPage === 1) {
            this.hasMoreResult = false;
            this.noResultMessage = "No result found.";
          }
          this.fetchingResult = false;
          this.resultPage++;
        },
        (error) => {
          console.log(error);
          this.isLoading = false;
        }
      )
    );
  }

  loadMoreProjects(): void {
    this.isLoading = true;
    this.loadProjects(this.resultPage, this.resultSize);
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  ViewTeams(projectId: number) {
    console.log('Viewing teams for projectId:', projectId);
    this.router.navigateByUrl(`/team-details`);
  }

  ViewManagers(projectId: number) {
    console.log('Viewing managers for projectId:', projectId);
    this.router.navigateByUrl(`/manager-details`);
  }

  editProject(projectId: any) {
    console.log('Editing project with ID:', projectId);
    this.router.navigate([`/edit-project`,projectId]);
  }

  deleteProject(projectId: number) {
    console.log('Deleting project with ID:', projectId);
    if (confirm('Are you sure you want to delete this project?')) {
      this.userService.deleteProject(projectId).subscribe(
        () => {
          this.successMessage = 'Project deleted Successfully';
          setTimeout(() => {
            this.successMessage = null;
            window.location.reload();
          }, 3000);
        },
        (error: any) => {
          this.errorMessage = 'An error occurred while deleting the project';
          setTimeout(() => {
            this.errorMessage = null;
          }, 3000);
        }
      );
    }
  }
}
