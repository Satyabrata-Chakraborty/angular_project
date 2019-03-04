import { Component, OnInit } from "@angular/core";
import { LoginService } from "services/service";
import { Router } from "@angular/router";
import { Response } from "@angular/http";

@Component({
  selector: "search-person",
  templateUrl: "./search.person.component.html"
})
export class SearchPerson implements OnInit {
  constructor(private serv: LoginService, private router: Router) {}
  ngOnInit(): void {}
  adminHome() {
    this.router.navigate(["adminhome"]);
  }
  per = {
    PersonalUniqueId: ""
  };
  searchedvalue: any;
  search() {
    this.serv.searchPerson(this.per).subscribe((resp: Response) => {
      console.log(resp);
      this.searchedvalue = resp.json().data;
    });
  }
}
