import { Routes } from '@angular/router';
import { UserTableComponent } from './pages/user-table/user-table.component';

export const routes: Routes = [
    {path: '', redirectTo: 'usuarios', pathMatch: 'full' },
    {path:'usuarios', component: UserTableComponent}
];
