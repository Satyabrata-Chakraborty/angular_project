import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserLogin } from './UserLoginComponent/userLogin.component';
import { HttpModule } from '@angular/http';
import { LoginService } from 'services/service';
import { AdminHome } from './AdminComponent/admin.home.component';
import { PendingUserList } from './PendingUsersComponent/pending.user.list.component';
import { PendingPersonList } from './PendingPersonComponent/pending.person.list.component';
import { SearchPerson } from './SearchComponent/search.person.component';
import { OperatorHome } from './OperatorComponent/operator.home.component';
import { PersonHome } from './PersonComponent/person.home.component';
import { PersonUpdateHome } from './PersonComponent/person.update.home.component';

@NgModule({
  declarations: [
    AdminHome,
    AppComponent,
    PendingUserList,
    PendingPersonList,
    SearchPerson,
    OperatorHome,
    PersonHome,
    PersonUpdateHome,
    UserLogin
  ],
  imports: [
    FormsModule,
    HttpModule,
    BrowserModule,
    AppRoutingModule
  ],
  providers: [LoginService],
  bootstrap: [AppComponent]
})
export class AppModule { }
