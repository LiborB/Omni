import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {Injectable} from "@angular/core";
import {UserService} from "../user/user.service";

@Injectable()
export class CanActivateApp implements CanActivate {
  constructor(private router: Router, private userService: UserService) {
  }

  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot) {
    if (route.title === "1") {
      return true
    } else {
      this.router.navigate(["/signup"])
      return false
    }
  }
}
