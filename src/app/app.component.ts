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

    this.choices = "Die westlichen Sanktionen werden keinerlei Auswirkungen haben, erklärte Russlands früherer Präsident Dmitri Medwedew vergangene Woche in einem Interview mit der russischen Nachrichtenagentur RIA. Sie würden auch nicht zu Unmut führen, sagt er. Im Gegenteil, verkündet er vollmundig. Die Sanktionen würden die russische Gesellschaft sogar festigen. Mehrere Videos, die in den sozialen Netzwerken hochgeladen wurden, zeichnen ein anderes, aber auch immer ähnliches Bild. Offiziell gehen Russland die Grundnahrungsmittel nach dem Rückzug westlicher Unternehmen aus dem Land nicht aus. Dennoch scheinen sich Russinnen und Russen seit dem Angriff auf die Ukraine immer wieder um Lebensmittel wie Zucker streiten zu müssen. Mitarbeiterinnen oder Mitarbeiter scheinen in unterschiedlichen Supermärkten selbst zu filmen, wie sie eine kleine Ladung in einen Gang rollen. Es dauert nur einen kleinen Moment, bis Chaos ausbricht: Menschen rennen zum Zucker, versuchen, möglichst viele Packungen zu greifen, reißen sie sich gegenseitig aus der Hand, schubsen sich, schreien sich an.".split(' ');
  }

}
