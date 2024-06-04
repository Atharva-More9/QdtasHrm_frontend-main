import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { AddUserComponent } from './add-user/add-user.component';
import { LeaveComponent } from './leave/leave.component';
import { TimeComponent } from './time/time.component';
import { MyInfoComponent } from './my-info/my-info.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { TempPasswordComponent } from './temp-password/temp-password.component';
import { TimeSheetDataComponent } from './time-sheet-data/time-sheet-data.component';
import { AuthGuard } from './shared/auth.guard';
import { ProjectsComponent } from './projects/projects.component';

import { TeamDetailsComponent } from './team-details/team-details.component';
import { ManagerDetailsComponent } from './manager-details/manager-details.component';
import { EditProjectComponent } from './edit-project/edit-project.component';



const routes: Routes = [
  { path: 'team-details',
    component: TeamDetailsComponent
  },

  { path: 'manager-details',
    component: ManagerDetailsComponent
  },

  {
    component: LoginComponent,
    path: ''
  },
  {
    component: ProfileComponent,
    path: 'profile',
     canActivate: [AuthGuard]
  },
  {
    component: AddUserComponent,
    path: 'adduser',
     canActivate: [AuthGuard]
  },
  {
    component: LeaveComponent,
    path: 'leave',
     canActivate: [AuthGuard]
  },
  {
    component: TimeComponent,
    path: 'time',
     canActivate: [AuthGuard]
  },
  {
    component: MyInfoComponent,
    path: 'myinfo',
     canActivate: [AuthGuard]
  },
  {
    component: EditUserComponent,
    path: 'edit-user',
     canActivate: [AuthGuard]
  },
  {
    component: ResetPasswordComponent,
    path: 'reset',
     canActivate: [AuthGuard]
  },
  {
    component: TempPasswordComponent,
    path: 'changeTempPassword',
     canActivate: [AuthGuard]
  },
   {
    component: TimeSheetDataComponent,
    path: 'timesheet',
    canActivate: [AuthGuard]
  },
   {
    component: ProjectsComponent,
    path: 'project',
    canActivate: [AuthGuard]
  },

  { path: 'projects', component: ProjectsComponent,canActivate: [AuthGuard]  },
  { path: 'edit-project/:projectId', component: EditProjectComponent,canActivate: [AuthGuard] },
  { path: '', redirectTo: '/projects', pathMatch: 'full' },
  { path: '**', redirectTo: '/projects' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
