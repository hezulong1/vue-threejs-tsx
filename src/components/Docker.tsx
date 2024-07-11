import type { FunctionalComponent, HTMLAttributes } from 'vue';
import './Docker.css';

interface DockerProps extends HTMLAttributes {
  centered?: boolean;
}

const Docker: FunctionalComponent<DockerProps> = (props, ctx) => {
  const cn = {
    Docker: true,
    centered: props.centered,
  };
  return <div class={cn}>{ctx.slots.default?.()}</div>;
};

Docker.props = {
  centered: Boolean,
};

Docker.displayName = 'Docker';

export default Docker;
