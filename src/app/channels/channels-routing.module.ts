import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChannelsComponent } from './channels.component';

const routes: Routes = [
  { path: '', component: ChannelsComponent }, 
  { path: ':id', loadChildren: () => import('./channel/channel.module').then(m => m.ChannelModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChannelsRoutingModule { }
