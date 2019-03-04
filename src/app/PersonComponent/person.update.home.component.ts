import { Component, OnInit } from "@angular/core";
import { LoginService } from "services/service";
import { Router } from "@angular/router";
import { Response } from "@angular/http";

@Component({
  selector: "person-update-home",
  templateUrl: "./person.update.home.component.html"
})
export class PersonUpdateHome implements OnInit {
  UserId: any;
  Person: any = {
    PersonalUniqueId: ""
  };
  OldPerson: any;
  constructor(private serv: LoginService, private router: Router) {
    this.UserId = sessionStorage.getItem("UserId");
  }
  ngOnInit(): void {
    this.serv
      .loadSpecificPerson(sessionStorage.getItem("UserId"))
      .subscribe((resp: Response) => {
        this.Person = resp.json().data;
        this.OldPerson = resp.json().data;
        console.log("Polo");
      });
  }
  onUpdate() {
    if (JSON.stringify(this.Person) != JSON.stringify(this.OldPerson)) {
      this.serv
        .findSpecificTempPerson(this.Person.PersonalUniqueId)
        .subscribe((resp: Response) => {
          if (resp.json().data != null) {
            alert(
              "Failed! You have a previous pending request for update to be approved from Administrator"
            );
          } else {
            this.serv.updatePerson(this.Person).subscribe((resp: Response) => {
              alert("Request of update is sent to admin for approval");
              this.Person = resp.json().data;
              localStorage.removeItem("token");
              sessionStorage.removeItem("UserId");
              sessionStorage.removeItem("UserName");
              this.router.navigate([""]);
            });
          }
        });
    } else {
      alert("Failed! There are no modification in entries to be updated");
    }
  }
  onCancel() {
    localStorage.removeItem("token");
    sessionStorage.removeItem("UserId");
    sessionStorage.removeItem("UserName");
    this.router.navigate([""]);
  }
}
