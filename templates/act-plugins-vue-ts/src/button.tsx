// Button.tsx
import { defineComponent, PropType } from 'vue';

const Button = defineComponent({
  name: 'Button',
  props: {
    label: {
      type: String as PropType<string>,
      required: true,
    },
    onClick: {
      type: Function as PropType<() => void>,
      required: false,
    },
  },
  setup(props) {
    const handleClick = () => {
      if (props.onClick) {
        props.onClick();
      }
    };

    return () => (
      <button onClick={handleClick} className="btn">
        {props.label}
      </button>
    );
  },
});

export default Button;