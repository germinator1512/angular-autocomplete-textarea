import {Component} from '@angular/core';
import {Subject} from "rxjs";

@Component({
  selector: 'app-auto-complete-dropdown',
  templateUrl: './auto-complete-dropdown.component.html',
  styleUrls: ['./auto-complete-dropdown.component.scss']
})
export class AutoCompleteDropdownComponent {
  public choices: string[] = [];
  public position: { top: number; left: number } | undefined;
  public selectChoice = new Subject<string>();
}
