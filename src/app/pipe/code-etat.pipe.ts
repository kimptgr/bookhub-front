import {Pipe, PipeTransform} from '@angular/core';
import {CodeEtat} from '../models/enum/code-etat.enum';

@Pipe({ name: 'codeEtat' })
export class CodeEtatPipe implements PipeTransform {
  transform(value: string): string {
    return CodeEtat[value as keyof typeof CodeEtat] ?? value;
  }
}
