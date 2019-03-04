import { Component, OnInit } from "@angular/core";
import { LoginService } from "services/service";
import { Response } from "@angular/http";
import { Router } from "@angular/router";

@Component({
  selector: "operator-home",
  templateUrl: "./operator.home.component.html"
})
export class OperatorHome implements OnInit {
  constructor(private serv: LoginService, private router: Router) {}
  User = {
    UserId: "",
    UserName: "",
    EmailAddress: "",
    Password: "",
    RoleId: ""
  };
  retypepwd: any;
  ngOnInit(): void {}
  save() {
    if (this.User.Password != this.retypepwd)
      alert("Password fields didn't match");
    else {
      this.serv.saveUser(this.User).subscribe(
        (resp: Response) => {
          localStorage.setItem("token", `Bearer ${resp.json().token}`);
          this.router.navigate([""]);
        },
        error => {
          console.log(`${error}`);
        }
      );
    }
  }
  logout() {
    localStorage.removeItem("token");
    this.router.navigate([""]);
    this.router.navigate([""]);
  }
}
