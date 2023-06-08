import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './messages/messages.component';
import { AuthGuard } from './_guards/auth.guard';
import { ErrorComponent } from './errors/test/error/error.component';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: "members",
    runGuardsAndResolvers:"always",
    canActivate: [AuthGuard],
    children: [ // manejar un conjunto de rutas hijas de un ruta principal
      {
        path: '',
        component: MemberListComponent,
      },
      {
        path: ':id',
        component: MemberDetailComponent,
      },
      {
        path: 'lists',
        component: ListsComponent,
      },
      {
        path: 'messages',
        component: MessagesComponent,
      },
    ]
  },
  {
    path:"errors", component: ErrorComponent
  },
  {
    path: 'not-found',
    component: NotFoundComponent,
    pathMatch:"full"
  },
  {
    path: 'server-error',
    component: ServerErrorComponent,
    pathMatch:"full"
  },
  {
    path: '**',
    component: NotFoundComponent,
    pathMatch:"full"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
