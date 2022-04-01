import {
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  ElementRef, EventEmitter,
  HostListener,
  Injector, Input,
  OnDestroy, Output,
  ViewContainerRef
} from '@angular/core';
import {AutoCompleteDropdownComponent} from "./aut-complete-dropdown/auto-complete-dropdown.component";
import {Subject, takeUntil} from "rxjs";
// @ts-ignore
import getCaretCoordinates from 'textarea-caret';
// @ts-ignore
import toPX from 'to-px';

interface TextAreaValues {
  before: string;
  word: string;
  after: string;
}

@Directive({
  selector: 'textarea[appAutoComplete],input[type="text"][appAutoComplete]'
})
export class AutoCompleteDirective implements OnDestroy {

  private menuHidden$ = new Subject();

  @Input() choices: Array<string> = [];
  @Input() minimalCharactersToTriggerAutoComplete: number = 4;
  @Output() choiceSelected = new EventEmitter<string>();
  @Output() menuShown = new EventEmitter();

  private values: TextAreaValues = {
    before: '',
    word: '',
    after: ''
  }

  private menu: ComponentRef<AutoCompleteDropdownComponent> | undefined;

  constructor(private elm: ElementRef,
              private componentFactoryResolver: ComponentFactoryResolver,
              private viewContainerRef: ViewContainerRef,
              private injector: Injector,) {
  }

  @HostListener('input', ['$event.target.value'])
  onChange(value: string) {
    this.setTextValue(value);

    const word = this.values.word;
    let choices: Set<string> = new Set();

    if (word.length >= this.minimalCharactersToTriggerAutoComplete) {
      choices = new Set(this.choices
        .filter(t => t.startsWith(word) && t.length > word.length)
        .sort()
        .slice(0, 5));
    }
    choices.size > 0 ? this.showMenu([...choices]) : this.hideMenu()
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler() {
    this.hideMenu();
    const textarea: HTMLTextAreaElement = this.elm.nativeElement;
    const setCursorAt = (this.values.before + this.values.word).length;
    textarea.focus();
    textarea.setSelectionRange(setCursorAt, setCursorAt);
  }

  private setTextValue(changeValue: string): void {
    const triggerCharacterPosition = this.elm.nativeElement.selectionStart;
    const allBeforeTriggerCharacter = changeValue.slice(0, triggerCharacterPosition)
    const start = allBeforeTriggerCharacter.lastIndexOf(' ');

    const wordBeforeTrigger = allBeforeTriggerCharacter
      .slice(start === -1 ? 0 : start, allBeforeTriggerCharacter.length)
      .trim();

    const allBeforeTriggerWord = allBeforeTriggerCharacter.slice(0, allBeforeTriggerCharacter.length - wordBeforeTrigger.length);

    const allAfterTriggerWord = changeValue.slice(triggerCharacterPosition, changeValue.length)

    this.values = {
      before: allBeforeTriggerWord,
      word: wordBeforeTrigger,
      after: allAfterTriggerWord
    }
  }

  private showMenu(choices: Array<string>) {
    if (!this.menu) {
      const menuFactory = this.componentFactoryResolver.resolveComponentFactory<AutoCompleteDropdownComponent>(AutoCompleteDropdownComponent);

      this.menu = this.viewContainerRef.createComponent(
        menuFactory,
        0,
        this.injector
      );


      this.menu.instance.selectChoice.pipe(
        takeUntil(this.menuHidden$)
      ).subscribe((choice: string) => this.onChoiceSelected(choice));

      this.menuShown.emit();
    }

    const lineHeight = AutoCompleteDirective.getLineHeight(this.elm.nativeElement);
    let triggerCharacterPosition = this.elm.nativeElement.selectionStart;

    const {top, left} = getCaretCoordinates(this.elm.nativeElement, triggerCharacterPosition);

    this.menu.instance.position = {
      top: top + lineHeight + 5,
      left
    };

    this.menu.changeDetectorRef.detectChanges();
    this.menu.instance.choices = choices;
  }

  private onChoiceSelected(choice: string) {
    this.hideMenu();
    const setCursorAt = (this.values.before + choice).length;
    const textarea: HTMLTextAreaElement = this.elm.nativeElement;

    textarea.value = this.values.before + choice + this.values.after;
    textarea.dispatchEvent(new Event('input'));
    textarea.focus();
    textarea.setSelectionRange(setCursorAt, setCursorAt);
    this.choiceSelected.emit(choice);
  }

  private hideMenu() {
    if (this.menu) {
      this.menu.destroy();
      this.menuHidden$.next(true);
      this.menu = undefined;
    }
  }

  ngOnDestroy() {
    this.hideMenu();
  }

  private static getLineHeight(elm: HTMLElement): number {
    const lineHeightStr = getComputedStyle(elm).lineHeight || '';
    const fontSizeStr = getComputedStyle(elm).fontSize || '';
    const fontSize = +toPX(fontSizeStr);
    const normal = 1.2;
    const lineHeightNum = parseFloat(lineHeightStr);

    if (lineHeightStr === lineHeightNum + '') {
      return fontSize * lineHeightNum;
    }

    if (lineHeightStr.toLowerCase() === 'normal') {
      return fontSize * normal;
    }

    return toPX(lineHeightStr);
  }
}
