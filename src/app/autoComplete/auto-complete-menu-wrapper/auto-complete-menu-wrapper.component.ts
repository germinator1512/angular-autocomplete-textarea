import {Component} from '@angular/core';

@Component({
  selector: 'app-auto-complete-menu-wrapper',
  styles: [
    `:host {
      position: relative;
      display: block;
    }`
  ],
  template: '<ng-content></ng-content>'
})
export class AutoCompleteMenuWrapperComponent {

}
