import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "./user.model";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {
  }

  signup(data: { username: string, password: string }) {
    return this.http.post<User>("/user", {
      username: data.username, password: data.password
    })
  }

  auth(token: string) {
    return this.http.post<User>("/auth", {
      token
    })
  }


}
