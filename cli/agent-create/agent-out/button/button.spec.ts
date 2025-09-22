// Button.spec.ts
import { render, fireEvent } from '@testing-library/vue';
import Button from './Button.vue';
import { describe, it, expect } from 'vitest';

describe('Button.vue', () => {
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

  it('does not call onClick when disabled', async () => {
    const onClick = vi.fn();
    const { getByText } = render(Button, {
      props: { label: 'Click Me', disabled: true, onClick },
    });
    await fireEvent.click(getByText('Click Me'));
    expect(onClick).not.toHaveBeenCalled();
  });
});