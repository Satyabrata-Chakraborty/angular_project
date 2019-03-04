import { Component, OnInit } from "@angular/core";
import { LoginService } from "services/service";
import { Response } from "@angular/http";
import { Router } from "@angular/router";

@Component({
  selector: "pending-user-list",
  templateUrl: "./pending.user.list.component.html"
})
export class PendingUserList implements OnInit {
  constructor(private serv: LoginService, private router: Router) {}
  user: any[];
  ngOnInit(): void {
    this.serv.loadUser().subscribe((resp: Response) => {
      console.log(resp);
      this.user = resp.json().data;
    });
  }

  adminhome() {
    this.router.navigate(["/adminhome"]);
  }

  approve(user) {
    this.serv.createUser(user).subscribe((resp: Response) => {
      console.log(resp);
    });

    this.serv.createUstatus(user).subscribe((resp:Response)=>{
      console.log(resp);
    })

    this.serv.deleteTempUser(user).subscribe((resp: Response) => {
      if (resp.status === 200) {
        window.location.reload();
      }
    });
  }

  reject(user) {
    this.serv.deleteTempUser(user).subscribe((resp: Response) => {
      if (resp.status === 200) {
        window.location.reload();
      }
    });
  }
}
