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

interface TriggerArea {
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
  @Output() choiceSelected = new EventEmitter<string>();
  @Output() menuShown = new EventEmitter();

  private words: TriggerArea = {
    before: '',
    word: '',
    after: ''
  }

  private menu: {
    component: ComponentRef<AutoCompleteDropdownComponent>;
    triggerCharacterPosition: number;
  } | undefined;

  constructor(private elm: ElementRef,
              private componentFactoryResolver: ComponentFactoryResolver,
              private viewContainerRef: ViewContainerRef,
              private injector: Injector,) {
  }

  @HostListener('input', ['$event.target.value'])
  onChange(value: string) {
    this.getTextValue(value);

    const word = this.words.word;
    let choices: Set<string> = new Set();

    if (word.length > 3) {
      choices = new Set(this.choices
        .filter(t => t.startsWith(word) && t.length > word.length)
        .sort()
        .slice(0, 5));
    }

    choices.size > 0 ? this.showMenu([...choices]) : this.hideMenu()
  }

  private getTextValue(changeValue: string): void {
    const triggerCharacterPosition = this.elm.nativeElement.selectionStart;
    const allBeforeTriggerCharacter = changeValue.slice(0, triggerCharacterPosition)
    const start = allBeforeTriggerCharacter.lastIndexOf(' ');

    const wordBeforeTrigger = allBeforeTriggerCharacter
      .slice(start === -1 ? 0 : start, allBeforeTriggerCharacter.length)
      .trim();

    const allBeforeTriggerWord = allBeforeTriggerCharacter.slice(0, allBeforeTriggerCharacter.length - wordBeforeTrigger.length);

    const allAfterTriggerWord = changeValue.slice(triggerCharacterPosition, changeValue.length)

    this.words = {
      before: allBeforeTriggerWord,
      word: wordBeforeTrigger,
      after: allAfterTriggerWord
    }
  }

  private showMenu(choices: Array<string>) {
    if (!this.menu) {
      const menuFactory = this.componentFactoryResolver.resolveComponentFactory<AutoCompleteDropdownComponent>(AutoCompleteDropdownComponent);
      let triggerCharacterPosition = this.elm.nativeElement.selectionStart;

      this.menu = {
        component: this.viewContainerRef.createComponent(
          menuFactory,
          0,
          this.injector
        ),
        triggerCharacterPosition: triggerCharacterPosition
      };

      const lineHeight = AutoCompleteDirective.getLineHeight(this.elm.nativeElement);
      const {top, left} = getCaretCoordinates(
        this.elm.nativeElement,
        triggerCharacterPosition
      );

      this.menu.component.instance.position = {
        top: top + lineHeight,
        left
      };

      this.menu.component.changeDetectorRef.detectChanges();
      this.menu.component.instance.choices = choices;
      this.menu.component.instance.selectChoice.pipe(
        takeUntil(this.menuHidden$)
      ).subscribe((choice: string) => this.onChoiceSelected(choice));

      this.menuShown.emit();
    }
  }

  private onChoiceSelected(choice: string) {
    const textarea: HTMLTextAreaElement = this.elm.nativeElement;

    textarea.value = this.words.before + choice + this.words.after;
    console.log(this.words.before + choice)
    console.log((this.words.before + choice).length)

    textarea.dispatchEvent(new Event('input'));
    this.hideMenu();
    const setCursorAt = (this.words.before + choice).length;
    textarea.focus();
    textarea.setSelectionRange(setCursorAt, setCursorAt);
    this.choiceSelected.emit(choice);
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

  private hideMenu() {
    if (this.menu) {
      this.menu.component.destroy();
      this.menuHidden$.next(true);
      this.menu = undefined;
    }
  }

  ngOnDestroy() {
    this.hideMenu();
  }
}
