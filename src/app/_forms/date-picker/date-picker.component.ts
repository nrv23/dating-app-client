import { Component, Input, OnInit, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css']
})
export class DatePickerComponent implements ControlValueAccessor {

  @Input() label = '';
  @Input() maxDate: Date | undefined;
  baseConfig: Partial<BsDatepickerConfig> | undefined;

  constructor(@Self() public ngControl: NgControl) { 
    this.ngControl.valueAccessor = this;
    this.baseConfig = {
      containerClass: 'theme-red',
      dateInputFormat:'DD MMMM YYYY' // este es el formato que muestra la fecha en el html
    } 
  }
  writeValue(obj: any): void {

  }
  registerOnChange(fn: any): void {

  }
  registerOnTouched(fn: any): void {

  }

  get control() : FormControl {
    return this.ngControl.control as FormControl;
  }

}
