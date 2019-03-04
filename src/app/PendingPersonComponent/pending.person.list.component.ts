import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { LoginService } from "services/service";
import { Response } from "@angular/http";

@Component({
  selector: "pending-person-list",
  templateUrl: "./pending.person.list.component.html"
})
export class PendingPersonList implements OnInit {
  pendingperson: any;
  constructor(private router: Router, private serv: LoginService) {}
  ngOnInit(): void {
    this.serv.loadPendingPerson().subscribe((resp: Response) => {
      console.log(resp);
      this.pendingperson = resp.json().data;
    });
  }

  adminhome() {
    this.router.navigate(["/adminhome"]);
  }

  approve(person) {

    this.serv.deletePerson(person).subscribe((resp: Response) => {
      console.log(resp);
    });

    this.serv.createPerson(person).subscribe((resp: Response) => {
      console.log(resp);
    });

    this.serv.deleteTempPerson(person).subscribe((resp: Response) => {
      if (resp.status === 200) {
        window.location.reload();
      }
    });
  }

  reject(person) {
    this.serv.deleteTempPerson(person).subscribe((resp: Response) => {
      if (resp.status === 200) {
        window.location.reload();
      }
    });
  }
}
