import {Component} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public choices: string[] = [];
  public form: FormGroup;

  constructor() {
    this.form = new FormGroup({
      textarea: new FormControl('')
    })

    this.choices = ['approaching', 'approximating', 'apprentice'];
  }

}
