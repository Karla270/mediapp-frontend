import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  username: string;
  rol: string;

  constructor(
  ) { }

  ngOnInit(): void {
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(sessionStorage.getItem(environment.TOKEN_NAME));
    this.username = decodedToken.user_name;
    this.rol= decodedToken.authorities.concat();
  }

}
