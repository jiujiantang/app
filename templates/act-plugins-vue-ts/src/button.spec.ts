// Button.spec.ts
import { render, fireEvent } from '@testing-library/vue';
import Button from './button';
import { describe, it, expect } from 'vitest';

describe('Button', () => {
  it('renders the label', () => {
    const { getByText } = render(Button, {
      props: { label: 'Click Me' },
    });
    expect(getByText('Click Me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn();
    const { getByText } = render(Button, {
      props: { label: 'Click Me', onClick },
    });
    await fireEvent.click(getByText('Click Me'));
    expect(onClick).toHaveBeenCalled();
  });
});