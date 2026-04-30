import { registerDecorator, ValidationOptions } from 'class-validator';
import { IsTagConstraint } from '../validators/is-tag.validator';

export function IsTag(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsTagConstraint,
    });
  };
}
