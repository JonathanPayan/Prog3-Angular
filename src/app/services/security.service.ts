import { Injectable } from '@angular/core';
import { LoginModel } from '../models/login.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ServiceConfig } from '../config/service-config';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  LoginData = new BehaviorSubject<LoginModel>(new LoginModel);

  constructor(
    private http: HttpClient
  ) { 
    this.verifyUserSession();
  }

  verifyUserSession(){
    let userSession = this.getSessionData();
    if(userSession){
      this.setLoginData(JSON.parse(userSession));
    }
  }

  setLoginData(login: LoginModel){
    this.LoginData.next(login);
  }

  getLoginData(){
    return this.LoginData.asObservable();
  }

  LoginUser(login: LoginModel): Observable<any> {
    return this.http.post<any>(`${ServiceConfig.BASE_URL}login`, login, {
      headers: new HttpHeaders({})
    });
  }

  saveSeccionData(sessionData: any): Boolean{
    let userSession = localStorage.getItem('session');
    if(userSession){
      return false;
    } else {
      let data: LoginModel = {
        email: sessionData.data.email,
        password: sessionData.data.password,
        isLogged: true
      };
      localStorage.setItem('session', JSON.stringify(data));
      this.setLoginData(data);
      return true;
    }
  }

  getSessionData(){
    let userSession = localStorage.getItem('session');
    return userSession;
  }

  logout(){
    localStorage.removeItem('session');
    this.setLoginData(new LoginModel());
  }
}