import { describe, it, expect } from 'vitest';
import { toHtml } from '../src/index.js';

describe('ReDoS protection', () => {
  it('should handle nested quantifiers in link pattern', () => {
    const input = '[[' + 'a'.repeat(1000) + ']]';
    const start = Date.now();
    toHtml(input);
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(100);
  });

  it('should handle nested quantifiers in strong pattern', () => {
    const input = '**' + '*'.repeat(1000) + '**';
    const start = Date.now();
    toHtml(input);
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(100);
  });

  it('should handle nested quantifiers in emphasis pattern', () => {
    const input = '//' + '/'.repeat(1000) + '//';
    const start = Date.now();
    toHtml(input);
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(100);
  });

  it('should handle nested quantifiers in image caption pattern', () => {
    const input = '{{image.png|' + 'a'.repeat(1000) + '}}';
    const start = Date.now();
    toHtml(input);
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(100);
  });

  it('should handle nested quantifiers in list pattern', () => {
    const input = '* item\n' + '  continuation\n'.repeat(100);
    const start = Date.now();
    toHtml(input);
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(100);
  });

  it('should reject input exceeding maxInputLength', () => {
    const input = 'a'.repeat(200 * 1024);
    expect(() => toHtml(input)).toThrow('Input exceeds maximum length');
  });

  it('should allow custom maxInputLength', () => {
    const input = 'a'.repeat(1024);
    expect(() => toHtml(input, { maxInputLength: 500 })).toThrow('Input exceeds maximum length');
    expect(() => toHtml(input, { maxInputLength: 2000 })).not.toThrow();
  });
});
