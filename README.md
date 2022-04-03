# Angular AutocompleteDirective for TextAreas

Demo https://angular-autocomplete-dropdown.web.app/

A angular directive for adding autocomplete functionality to text areas, given a list of words.

```html
  <textarea appAutoComplete
            [minimalCharactersToTriggerAutoComplete]="4"
            [choices]="['approaching', 'approximating', 'apprentice']">

  </textarea>
```

![alt text](https://user-images.githubusercontent.com/65281921/161270557-e57537f4-f2b8-49fb-b5dd-bc9028379511.png)

Dropdown menu is a Prime Ng ListBox, can be easily replaced with your own Component.


```html
  <p-listbox [options]="choices"
             (onChange)="selectChoice.next($event.value)">

  </p-listbox>
```
# Inspired by

https://github.com/mattlewis92/angular-text-input-autocomplete

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.3.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you
change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also
use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a
package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out
the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
