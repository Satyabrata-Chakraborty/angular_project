import { Component, OnInit } from "@angular/core";
import { LoginService } from "./../../../services/service";
import { Router } from "@angular/router";
import { Response } from "@angular/http";
@Component({
  selector: "app-root",
  templateUrl: "userLogin.component.html"
})
export class UserLogin implements OnInit {
  usr = {
    UserName: "",
    Password: ""
  };
  constructor(private serv: LoginService, private router: Router) {}
  ngOnInit(): void {
    // this.serv.getData().subscribe(
    //   (resp: Response) => {
    //     console.log(resp.json().data);
    //   },
    //   error => {
    //     console.log(`${error}`);
    //   }
    // )
  }

  userAuth() {
    this.serv.chkUser(this.usr).subscribe(
      (resp: Response) => {
        console.log(resp);
        localStorage.setItem("token", `Bearer ${resp.json().token}`);
        if (resp.json().role === "Administrator") {
          this.router.navigate(["/adminhome"]);
        } else if (resp.json().role === "Operator") {
          this.router.navigate(["/operatorhome"]);
        } else if (resp.json().role === "User") {
          this.serv.getUstatus(this.usr).subscribe((response: Response) => {
            if (response.json().data.flag === "0") {
              sessionStorage.setItem("UserId", resp.json().uid);
              sessionStorage.setItem("UserName",resp.json().uname);
              this.router.navigate(["/personhome"]);
            } else {
              sessionStorage.setItem("UserId", resp.json().uid);
              this.router.navigate(["/personupdatehome"]); //update
            }
          });
        } else {
          alert("Invalid Credentials");
          window.location.reload();
        }
      },
      error => {
        console.log(`${error}`);
      }
    );
  }
}
