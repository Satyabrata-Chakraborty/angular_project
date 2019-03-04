import { Component, OnInit } from "@angular/core";
import { LoginService } from "services/service";
import { Response } from "@angular/http";
import { Router } from "@angular/router";

@Component({
  selector: "person-home",
  templateUrl: "./person.home.component.html"
})
export class PersonHome implements OnInit {
  UserId: any;
  constructor(private serv: LoginService, private router: Router) {
    this.UserId = sessionStorage.getItem("UserId");
  }
  ngOnInit(): void {
    if (!localStorage.getItem("token") && !sessionStorage.getItem("UserId"))
      this.router.navigate([""]);
  }
  PersonDetails: any = {
    PersonalUniqueId: "",
    FirstName: "",
    MiddleName: "",
    LastName: "",
    Gender: "",
    DateOfBirth: "",
    Age: "",
    Flat: "",
    SocietyName: "",
    StreetName: "",
    City: "",
    State: "",
    PinCode: "",
    PhoneNo: "",
    MobileNo: "",
    PhysicalDisability: "",
    MaritalStatus: "",
    EducationStatus: "",
    BirthSign: ""
  };
  save() {
    this.PersonDetails.PersonalUniqueId = this.UserId; //Bind the PersonalUniqueId with UserId i.e. session storage value
    // console.log(this.PersonDetails);
    this.serv
      .createNewPerson(this.PersonDetails)
      .subscribe((resp: Response) => {});
    this.serv
      .uStatusUpdate(sessionStorage.getItem("UserName"))
      .subscribe((resp: Response) => {
        // console.log(resp);
        localStorage.removeItem("token");
        sessionStorage.removeItem("UserId");
        sessionStorage.removeItem("UserName");
        this.router.navigate([""]);
        alert("Data is sent for approval to admin");
      });
  }

  cancel() {
    localStorage.removeItem("token");
    sessionStorage.removeItem("UserId");
    sessionStorage.removeItem("UserName");
    this.router.navigate([""]);
  }
}
