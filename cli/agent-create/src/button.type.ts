// Button.typescriptTypes.ts
import { PropType } from 'vue';

export interface ButtonProps {
  label: string;
  onClick?: () => void;
}