import {Component, OnInit} from '@angular/core';
import {Auth} from "aws-amplify"
import {Router} from "@angular/router";
import {User} from "./user/user.model";
import {environment} from "../environments/environment";
import {AuthenticatorService} from "@aws-amplify/ui-angular";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public formFields = {
    signUp: {
      email: {
        order: 1
      },
      username: {
        order: 2
      },
      password: {
        order: 3
      },
      confirm_password: {
        order: 4
      }
    },
  }

  constructor(public authenticator: AuthenticatorService) {
  }
}
