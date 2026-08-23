import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { TemplesComponent } from './pages/temples/temples.component';
import { EventsComponent } from './pages/events/events.component';
import { CommunityComponent } from './pages/community/community.component';
import { PanchangComponent } from './pages/panchang/panchang.component';
import { FestivalComponent } from './pages/festival/festival.component';
import { DateandtimeComponent } from './pages/dateandtime/dateandtime.component';
import { AboutComponent } from './pages/about/about.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { AdddiscussionComponent } from './pages/community/adddiscussion/adddiscussion.component';
import { AddEventComponent } from './pages/events/add-event/add-event.component';
import { AddTempleComponent } from './pages/temples/add-temple/add-temple.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HelppageComponent } from './pages/helppage/helppage.component';
import { UsermanualComponent } from './pages/helppage/usermanual/usermanual.component';
import { DirectoryComponent } from './pages/business/directory/directory.component';
import { BusinessSubmissionComponent } from './pages/business/directory/business-submission/business-submission.component';
import { LoginRegisterationComponent } from './Auth/login-registeration/login-registeration.component';
import { ViewTempleComponent } from './pages/temples/view-temple/view-temple.component';
import { AddbuisnessComponent } from './pages/business/addbuisness/addbuisness.component';
import { ViewdirectoryComponent } from './pages/business/viewdirectory/viewdirectory.component';
import { adminGuard } from './Auth/admin.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'temples', component: TemplesComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'temples/add-temple', component: AddTempleComponent },
  { path: 'temples/view-temple/:id', component: ViewTempleComponent },
  { path: 'temples/edit-temple/:id', component: AddTempleComponent },
  { path: 'events', component: EventsComponent },
  { path: 'events/add-event', component: AddEventComponent },
  { path: 'community', component: CommunityComponent },
  { path: 'community/discussion/new', component: AdddiscussionComponent },
  { path: 'panchang', component: PanchangComponent },
  { path: 'festival', component: FestivalComponent },
  { path: 'dateandtime', component: DateandtimeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'help', component: HelppageComponent },
  { path: 'help/usermanual', component: UsermanualComponent },
  { path: 'business/directory', component: DirectoryComponent },
  {
    path: 'business/admin/business-submissions',
    component: BusinessSubmissionComponent,
    canActivate: [adminGuard],
  },
  {
    path: 'business/register',
    component: AddbuisnessComponent,
  },
  {
    path: 'business/register/:id',
    component: ViewdirectoryComponent,
  },
  {
    path: 'auth/login-registeration-forget',
    component: LoginRegisterationComponent,
  },
  { path: 'not-found', component: NotFoundComponent },
  { path: '**', redirectTo: '/not-found' } // This MUST be the last route
];