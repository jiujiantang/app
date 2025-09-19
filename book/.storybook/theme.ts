import { create } from '@storybook/theming';
import img from '../src/assets/logoV3.png';

declare module '*.png' {
  const value: string;
  export default value;
}

export default create({
  base: 'light',
  brandTitle: '溜云库前端组件库',
  brandUrl: './',
  brandImage: img,
  brandTarget: '_self',
});
