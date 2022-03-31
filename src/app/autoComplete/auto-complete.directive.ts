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


@Directive({
  selector: 'textarea[appAutoComplete],input[type="text"][appAutoComplete]'
})
export class AutoCompleteDirective implements OnDestroy {

  private menuHidden$ = new Subject();

  @Input() choices: Array<string> = [];
  @Output() choiceSelected = new EventEmitter<string>();
  @Output() menuShown = new EventEmitter();

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

    const words = value.split(' ');

    // TODO not use last word, use word where triggerCharacterPosition is at the moment
    const last = words[words.length - 1];

    let choices: Set<string> = new Set();

    if (last.length > 3) {
      choices = new Set(this.choices
        .filter(t => t.startsWith(last))
        .sort()
        .slice(0, 5));
    }

    choices.size > 0 ? this.showMenu([...choices]) : this.hideMenu()
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
    const value: string = textarea.value;

    const triggerCharacterPosition = this.menu!.triggerCharacterPosition;
    const start = value.slice(0, triggerCharacterPosition);

    const selectionStart = textarea.selectionStart;
    const end = value.slice(selectionStart);

    // TODO cut off value which triggered field to prevent duplicates
    textarea.value = start + choice + end;
    textarea.dispatchEvent(new Event('input'));
    this.hideMenu();
    const setCursorAt = (start + choice).length;
    textarea.setSelectionRange(setCursorAt, setCursorAt);
    textarea.focus();
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
