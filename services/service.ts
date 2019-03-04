import { Injectable } from "@angular/core";
import { Http, Response, RequestOptions, Headers } from "@angular/http";
import { Observable } from "rxjs";

@Injectable()
export class LoginService {
  url: String;
  constructor(private http: Http) {
    this.url = "http://localhost:4070";
  }

  chkUser(usr): Observable<Response> {
    let resp: Observable<Response>;
    let header: Headers = new Headers({ "Content-Type": "application/json" });
    let options: RequestOptions = new RequestOptions();
    options.headers = header;
    resp = this.http.post(
      `${this.url}/users/auth`,
      JSON.stringify(usr),
      options
    );
    return resp;
  }

  loadPerson(): Observable<Response> {
    let resp: Observable<Response>;
    let header: Headers = new Headers({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token")
    });
    let options: RequestOptions = new RequestOptions();
    options.headers = header;
    resp = this.http.get(`${this.url}/api/person`, options);
    return resp;
  }

  loadUser(): Observable<Response> {
    let resp: Observable<Response>;
    let header: Headers = new Headers({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token")
    });
    let options: RequestOptions = new RequestOptions();
    options.headers = header;
    resp = this.http.get(`${this.url}/api/user`, options);
    return resp;
  }

  loadPendingPerson() {
    let resp: Observable<Response>;
    let header: Headers = new Headers({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token")
    });
    let options: RequestOptions = new RequestOptions();
    options.headers = header;
    resp = this.http.get(`${this.url}/api/temporaryperson`, options);
    return resp;
  }

  searchPerson(per) {
    let resp: Observable<Response>;
    let header: Headers = new Headers({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token")
    });
    let options: RequestOptions = new RequestOptions();
    options.headers = header;
    resp = this.http.post(
      `${this.url}/api/search/person`,
      JSON.stringify(per),
      options
    );
    return resp;
  }

  saveUser(User) {
    let resp: Observable<Response>;
    let header: Headers = new Headers({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token")
    });
    let options: RequestOptions = new RequestOptions();
    options.headers = header;
    resp = this.http.post(
      `${this.url}/tempusers/create`,
      JSON.stringify(User),
      options
    );
    return resp;
  }

  createUser(User) {
    let resp: Observable<Response>;
    let header: Headers = new Headers({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token")
    });
    let options: RequestOptions = new RequestOptions();
    options.headers = header;
    resp = this.http.post(
      `${this.url}/users/create`,
      JSON.stringify(User),
      options
    );
    return resp;
  }

  deleteTempUser(User) {
    let resp: Observable<Response>;
    let header: Headers = new Headers({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token")
    });
    let options: RequestOptions = new RequestOptions();
    options.headers = header;
    resp = this.http.delete(
      `${this.url}/api/tempuser/delete${User.UserId}`,
      options
    );
    return resp;
  }
  //#region Create person in person collection
  createPerson(Per): Observable<Response> {
    let resp: Observable<Response>;
    let header: Headers = new Headers({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token")
    });
    let options: RequestOptions = new RequestOptions();
    options.headers = header;
    resp = this.http.post(
      `${this.url}/api/create/person`,
      JSON.stringify(Per),
      options
    );
    return resp;
  }
  //#endregion

  //#region Delete from tempPerson collection
  deleteTempPerson(Per): Observable<Response> {
    let resp: Observable<Response>;
    let header: Headers = new Headers({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token")
    });
    let options: RequestOptions = new RequestOptions();
    options.headers = header;
    resp = this.http.delete(
      `${this.url}/api/tempperson/delete${Per.PersonalUniqueId}`,
      options
    );
    return resp;
  }
  //#endregion

  getUstatus(User): Observable<Response> {
    let resp: Observable<Response>;
    let header: Headers = new Headers({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token")
    });
    let options: RequestOptions = new RequestOptions();
    options.headers = header;
    resp = this.http.post(
      `${this.url}/api/get/ustatus`,
      JSON.stringify(User),
      options
    );
    return resp;
  }

  //#region Create a person record in person collection linked with person home
  createNewPerson(Per): Observable<Response> {
    let resp: Observable<Response>;
    let header: Headers = new Headers({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token")
    });
    let options: RequestOptions = new RequestOptions();
    options.headers = header;
    resp = this.http.post(
      `${this.url}/api/tempperson/create`,
      JSON.stringify(Per),
      options
    );
    return resp;
  }
  //#endregion

  //#region Specific person details retrieval
  loadSpecificPerson(PersonalUniqueId): Observable<Response> {
    console.log(PersonalUniqueId);
    let resp: Observable<Response>;
    let header: Headers = new Headers({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token")
    });
    let options: RequestOptions = new RequestOptions();
    options.headers = header;
    resp = this.http.post(
      `${this.url}/api/person/findone${PersonalUniqueId}`,
      undefined, //Need to pass it as param and define body as undefined since it shows CORS error if it is passed in body
      options
    );
    return resp;
  }
  //#endregion

  //#region Linked with personUpdatehome related to record creation in temporary person list
  updatePerson(Per): Observable<Response> {
    let resp: Observable<Response>;
    let header: Headers = new Headers({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token")
    });
    let options: RequestOptions = new RequestOptions();
    options.headers = header;
    resp = this.http.post(
      `${this.url}/api/tempperson/create`,
      JSON.stringify(Per),
      options
    );
    return resp;
  }
  //#endregion

  //#region Specific person details retrieval from temporary person collection
  findSpecificTempPerson(PersonalUniqueId): Observable<Response> {
    let resp: Observable<Response>;
    let header: Headers = new Headers({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token")
    });
    let options: RequestOptions = new RequestOptions();
    options.headers = header;
    resp = this.http.post(
      `${this.url}/api/tempperson/findone${PersonalUniqueId}`,
      undefined, //Need to pass it as param and define body as undefined since it shows CORS error if it is passed in body
      options
    );
    return resp;
  }
  //#endregion

  //#region For creating Ustatus linked with person pending list approval
  createUstatus(user) {
    let resp: Observable<Response>;
    let header: Headers = new Headers({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token")
    });
    let options: RequestOptions = new RequestOptions();
    options.headers = header;
    resp = this.http.post(
      `${this.url}/api/ustatus/create${user.UserName}`,
      undefined, //Need to pass it as param and define body as undefined since it shows CORS error if it is passed in body
      options
    );
    return resp;
    //#endregion
  }

  //#region For updating ustatus list to 1
  uStatusUpdate(UserName) {
    let resp: Observable<Response>;
    let header: Headers = new Headers({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token")
    });
    let options: RequestOptions = new RequestOptions();
    options.headers = header;
    resp = this.http.put( //React uses post method instead of put rest of the api part works on put !!
      `${this.url}/api/update/ustatus${UserName}`,
      undefined, //Need to pass it as param and define body as undefined since it shows CORS error if it is passed in body
      options
    );
    return resp;
  }
  //#endregion

//#region Delete from tempPerson collection
deletePerson(Per): Observable<Response> {
  let resp: Observable<Response>;
  let header: Headers = new Headers({
    "Content-Type": "application/json",
    Authorization: localStorage.getItem("token")
  });
  let options: RequestOptions = new RequestOptions();
  options.headers = header;
  resp = this.http.delete(
    `${this.url}/api/person/delete${Per.PersonalUniqueId}`,
    options
  );
  return resp;
}
//#endregion

}
