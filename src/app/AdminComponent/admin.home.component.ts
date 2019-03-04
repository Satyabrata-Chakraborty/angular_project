import { Component, OnInit } from "@angular/core";
import { LoginService } from "services/service";
import { Response } from "@angular/http";
import { Router } from '@angular/router';

@Component({
  selector: "admin-home",
  templateUrl: "./admin.home.component.html"
})
export class AdminHome implements OnInit {
  constructor(private serv: LoginService,private router:Router) {}
  person :any[];
  ngOnInit(): void {
    this.serv.loadPerson().subscribe((resp: Response) => {
      console.log(resp);
      this.person =resp.json().data;
    });
  }

  pendingUserList(){
    this.router.navigate(["/pendinguserlist"])
  }
  pendingPersonList(){
    this.router.navigate(["/pendingpersonlist"])
  }
  searchPerson(){
    this.router.navigate(["/searchperson"]);
  }

  logout(){
    localStorage.removeItem("token");
    this.router.navigate([""]);
  }
}
