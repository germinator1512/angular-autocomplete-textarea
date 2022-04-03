import {Component} from '@angular/core';

@Component({
  selector: 'app-auto-complete-menu-wrapper',
  styles: [
    `:host {
      position: relative;
      display: block;
      z-index: 1000;
    }`
  ],
  template: '<ng-content></ng-content>'
})
export class AutoCompleteMenuWrapperComponent {

}
