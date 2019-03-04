import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserLogin } from './UserLoginComponent/userLogin.component';
import { AdminHome } from './AdminComponent/admin.home.component';
import { PendingUserList } from './PendingUsersComponent/pending.user.list.component';
import { PendingPersonList } from './PendingPersonComponent/pending.person.list.component';
import { SearchPerson } from './SearchComponent/search.person.component';
import { OperatorHome } from './OperatorComponent/operator.home.component';
import { PersonHome } from './PersonComponent/person.home.component';
import { PersonUpdateHome } from './PersonComponent/person.update.home.component';

const routes: Routes = [
  { path: "", component: UserLogin },
  { path: "adminhome", component: AdminHome},
  { path: "pendinguserlist", component: PendingUserList},
  { path: "pendingpersonlist", component: PendingPersonList},
  { path: "searchperson", component: SearchPerson},
  { path: "operatorhome", component: OperatorHome},
  { path: "personhome", component: PersonHome},
  { path: "personupdatehome", component: PersonUpdateHome}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
