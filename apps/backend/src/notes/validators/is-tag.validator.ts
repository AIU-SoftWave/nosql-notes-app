import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'istag', async: false })
export class IsTagConstraint implements ValidatorConstraintInterface {
  validate(tag: string) {
    // Tag format: lowercase, alphanumeric with hyphens, max 20 chars
    const tagRegex = /^[a-z0-9-]{1,20}$/;
    return tagRegex.test(tag);
  }

  defaultMessage() {
    return 'Tag must be lowercase, alphanumeric with hyphens, and max 20 characters';
  }
}
