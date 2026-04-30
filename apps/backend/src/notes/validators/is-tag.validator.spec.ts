import { IsTagConstraint } from './is-tag.validator';

describe('IsTagConstraint', () => {
  let validator: IsTagConstraint;

  beforeEach(() => {
    validator = new IsTagConstraint();
  });

  describe('valid tags', () => {
    it('should accept lowercase alphanumeric tags', () => {
      expect(validator.validate('validtag')).toBe(true);
      expect(validator.validate('tag123')).toBe(true);
      expect(validator.validate('a')).toBe(true);
    });

    it('should accept tags with hyphens', () => {
      expect(validator.validate('valid-tag')).toBe(true);
      expect(validator.validate('my-tag-123')).toBe(true);
      expect(validator.validate('-tag')).toBe(true);
    });

    it('should accept tags up to 20 characters', () => {
      expect(validator.validate('twentycharstagonlyyy')).toBe(true);
    });
  });

  describe('invalid tags', () => {
    it('should reject tags with uppercase letters', () => {
      expect(validator.validate('ValidTag')).toBe(false);
      expect(validator.validate('UPPER')).toBe(false);
      expect(validator.validate('MiXeD')).toBe(false);
    });

    it('should reject tags with spaces', () => {
      expect(validator.validate('tag with spaces')).toBe(false);
      expect(validator.validate(' tag')).toBe(false);
    });

    it('should reject tags with special characters', () => {
      expect(validator.validate('tag!')).toBe(false);
      expect(validator.validate('tag@#$')).toBe(false);
      expect(validator.validate('tag.123')).toBe(false);
      expect(validator.validate('tag_123')).toBe(false);
    });

    it('should reject tags longer than 20 characters', () => {
      expect(validator.validate('twentyonecharacterstag')).toBe(false);
    });

    it('should reject empty strings', () => {
      expect(validator.validate('')).toBe(false);
    });
  });

  describe('default message', () => {
    it('should return appropriate error message', () => {
      expect(validator.defaultMessage()).toBe(
        'Tag must be lowercase, alphanumeric with hyphens, and max 20 characters',
      );
    });
  });
});
