import { Component, OnInit } from '@angular/core';
import {AuthenticatorService} from "@aws-amplify/ui-angular";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private authService: AuthenticatorService) { }

  ngOnInit(): void {
  }

}
