import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export function isbnValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value: string = control.value;

    if (value.length === 13 && /^[0-9]+$/.test(value) && (value.startsWith("978") || value.startsWith("979"))) {
      return null;
    }

    if (
      value.length === 10 &&
      (
        /^[0-9]{10}$/.test(value) ||
        (/^[0-9]{9}$/.test(value.slice(0, 9)) &&
          value.toUpperCase().endsWith('X'))
      )
    ) {
      return null;
    }

    return {forbiddenName: {value: control.value}};
  }
}
