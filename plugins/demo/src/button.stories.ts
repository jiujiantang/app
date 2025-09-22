// Button.stories.ts
import { Meta, StoryFn } from '@storybook/vue3';
import Button from './Button';

export default {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
} as Meta;

const Template: StoryFn = (args) => ({
  components: { Button },
  setup() {
    return { args };
  },
  template: '<Button v-bind="args" />',
});

export const Default = Template.bind({});
Default.args = {
  label: 'Click Me',
  onClick: () => alert('Button clicked!'),
};