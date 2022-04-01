import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {ReactiveFormsModule} from "@angular/forms";
import {AutoCompleteDirective} from './autoComplete/auto-complete.directive';
import {AutoCompleteDropdownComponent} from './autoComplete/aut-complete-dropdown/auto-complete-dropdown.component';
import {ListboxModule} from 'primeng/listbox';
import { AutoCompleteMenuWrapperComponent } from './autoComplete/auto-complete-menu-wrapper/auto-complete-menu-wrapper.component';

@NgModule({
  declarations: [
    AppComponent,
    AutoCompleteDirective,
    AutoCompleteDropdownComponent,
    AutoCompleteMenuWrapperComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    ListboxModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
