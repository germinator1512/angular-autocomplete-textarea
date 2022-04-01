import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {ReactiveFormsModule} from "@angular/forms";
import {AutoCompleteDirective} from './autoComplete/auto-complete.directive';
import {AutoCompleteDropdownComponent} from './autoComplete/aut-complete-dropdown/auto-complete-dropdown.component';
import {ListboxModule} from 'primeng/listbox';

@NgModule({
  declarations: [
    AppComponent,
    AutoCompleteDirective,
    AutoCompleteDropdownComponent
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
