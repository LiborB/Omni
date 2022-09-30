import {Component, OnInit} from '@angular/core';
import {UserService} from "./user/user.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  isLoaded = false

  constructor(private userService: UserService) {
  }

  ngOnInit() {
    this.userService.signup()
    this.isLoaded = true
  }
}
