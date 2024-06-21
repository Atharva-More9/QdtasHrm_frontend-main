import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Token } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BASE_API_URL } from '../constansts';
import { Observable, Subject , forkJoin , throwError} from 'rxjs';
import { User } from '../model/user';
import { Leave } from '../model/leave';
import { map, catchError } from 'rxjs/operators';
import { Time } from '../model/time';
import {Project} from "../model/project";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private router: Router) { }
  loginSubject = new Subject<User>();


  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
  getHeadersWithoutToken() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    return headers;
  }

  storeAuthUserInCache(authUser: User): void {
    if (authUser != null) {
      localStorage.setItem("authUser", JSON.stringify(authUser));
    }
    this.loginSubject.next(authUser);
  }

  getAuthUserFromCache(): User {
    let user = localStorage.getItem("authUser") as string;
    var myObject: User = JSON.parse(user) as User;
    return myObject;
  }

  getAuthUserId(): number {
    return this.getAuthUserFromCache().userId;
  }

  // <----  Authemtication Services

  login(data: any) {
    return this.http.post(BASE_API_URL + `/user/login`, data, { headers: this.getHeadersWithoutToken() });
  }

  clearc() {
    localStorage.clear();
  }

  isLoggedIn() {
    const token = localStorage.getItem("token");
    if (token == null || token.length <= 0) {
      return false;
    } else {
      return true;
    }
  }

  //  Authemtication Services ---->

  resetPassword(email: string) {
    return this.http.post<any>(BASE_API_URL + `/user/resetPassword?email=` + email, { headers: this.getHeadersWithoutToken() });
  }

  changeTempPass(cp: any) {
    return this.http.post<any>(BASE_API_URL + `/user/changeTempPassword`, cp, { headers: this.getHeadersWithoutToken() });
  }

  updateUser(uId: number, user: any) {
    return this.http.post<any>(BASE_API_URL + `/user/updateUser/` + uId, user, { headers: this.getHeaders() });
  }

  profile() {
    const user = localStorage.getItem('user');
  }

  addUser(user: any) {
    let headers = new HttpHeaders().set("Authorization", `Bearer ${localStorage.getItem('token')}`);
    return this.http.post<any>(BASE_API_URL + `/user/add`, user, { headers: this.getHeaders() });
  }

  getAllUsers(currentPage: number, resultSize: number) {
    return this.http.get<User[]>(BASE_API_URL + `/user/getAll?pgn=` + currentPage + `&sz=` + resultSize, { headers: this.getHeaders() });
  }

  seachUser(currentPage: number, resultSize: number , key :string) {
    return this.http.get<User[]>(BASE_API_URL + `/user/seachUser?pgn=` + currentPage + `&sz=` + resultSize + `&key=` + key, { headers: this.getHeaders() });
  }


  // getUserById(uId: number) {
  //   return this.http.get<any>(BASE_API_URL + `/user/` + uId, { headers: this.getHeaders() });
  // }

  getUserById(uId: number): Observable<User> {
    return this.http.get<any>(BASE_API_URL + `/user/` + uId, { headers: this.getHeaders() }).pipe(
      map(res => {
        // Map response data to User class
        return new User(
          res.userId,res.userName,res.email,res.password,res.firstName,res.middleName,res.lastName,res.gender,res.dept,res.role,res.phoneNumber,
          res.address,res.designation,res.emailVerified,res.birthDate,res.joinDate,res.projects
        );
      }),
      catchError(error => {
        console.error('Error occurred:', error);
        return throwError('Something went wrong while fetching user data.');
      })
    );
  }


  deleteUser(userId: number) {
    return this.http.post<String>(BASE_API_URL + `/user/deleteUser?uId=` + userId, userId, { headers: this.getHeaders() });

  }

  // leave methods

  getAllLeaves(currentPage: number, resultSize: number) {
    return this.http.get<Leave[]>(BASE_API_URL + `/leave/getAllLeaves?pgn=` + currentPage + `&sz=` + resultSize, { headers: this.getHeaders() });
  }



  applyLeave(leaveData: any, empId: number) {
    let headers = new HttpHeaders().set("Authorization", `Bearer ${localStorage.getItem('token')}`);
    return this.http.post<any>(BASE_API_URL + `/leave/create/` + empId, leaveData, { headers: this.getHeaders() });
  }


  deleteLeave(leaveId: number) {
    return this.http.post<String>(BASE_API_URL + `/leave/delete/` + leaveId, leaveId, { headers: this.getHeaders() });
  }

  changeLeaveStatus(leaveId: number) {
    return this.http.post<String>(BASE_API_URL + `/leave/reject/` + leaveId, leaveId, { headers: this.getHeaders() });
  }

  changeLeaveStatusApprove(leaveId: number) {
    return this.http.post<String>(BASE_API_URL + `/leave/approve/` + leaveId, leaveId, { headers: this.getHeaders() });
  }


  // Leave Methods


  //TimeSheet

  addTimeSheet(timeSheetData: any) {
    let headers = new HttpHeaders().set("Authorization", `Bearer ${localStorage.getItem('token')}`);
    return this.http.post<any>(BASE_API_URL + `/ts/add` , timeSheetData,  {headers:this.getHeaders() });
  }

  getTimeSheetByEmpId(currentPage: Number, resultSize: Number, eId: Number) {
      let headers = new HttpHeaders().set("Authorization", `Bearer ${localStorage.getItem('token')}`);
    return this.http.get<any>(BASE_API_URL + `/ts/getByEmpId/` + eId +  `?pgn=` + currentPage + `&sz=` + resultSize , { headers: this.getHeaders() });
  }


  //project Modules

  addProject(projectData: any) {
    let headers = new HttpHeaders().set("Authorization", `Bearer ${localStorage.getItem('token')}`);
    return this.http.post<any>(BASE_API_URL + `/project/add` , projectData,  {headers:this.getHeaders() });
  }

  getAllProjects(currentPage: Number, resultSize: Number,) {
      let headers = new HttpHeaders().set("Authorization", `Bearer ${localStorage.getItem('token')}`);
    return this.http.get<any>(BASE_API_URL + `/project/getAllProjects`  +  `?pgn=` + currentPage + `&sz=` + resultSize  , { headers: this.getHeaders() });
  }

  getProjectById(projectId: number): Observable<Project> {
    const url = BASE_API_URL +`/project/getProjectById/${projectId}`;
    return this.http.get<Project>(url,{headers:this.getHeaders()}).pipe(
      catchError((error: any) => {
        console.error('Error fetching project by ID:', error);
        throw error; // Rethrow the error to be handled by the caller
      })
    );
  }

  updateProject(projectId: number, project: Project): Observable<Project> {
    // Construct the URL for the update endpoint
    const url = BASE_API_URL + `/project/update/${projectId}`;

    // Send a PUT request to update the project with the provided project data
    return this.http.put<Project>(url, project, { headers: this.getHeaders() }).pipe(
      catchError((error: any) => {
        // Handle error
        console.error('Error updating project:', error);
        throw error; // Rethrow the error to be handled by the caller
      })
    );
  }


  deleteProject(projectId: number): Observable<any> {
    return this.http.delete(BASE_API_URL + `/project/delete/${projectId}`,{headers : this.getHeaders()});
  }
}



