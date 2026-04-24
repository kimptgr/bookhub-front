import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export function isbnValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const forbidden = control.value.replaceAll("-", "");

    if (forbidden.length === 13 && /^[0-9]+$/.test(forbidden) && (forbidden.startsWith("978") || forbidden.startsWith("979"))) {
      return null;
    }

    if (
      forbidden.length === 10 &&
      (
        /^[0-9]{10}$/.test(forbidden) ||
        (/^[0-9]{9}$/.test(forbidden.slice(0, 9)) &&
          forbidden.toUpperCase().endsWith('X'))
      )
    ) {
      return null;
    }

    return {forbiddenName: {value: control.value}};
  }
}
