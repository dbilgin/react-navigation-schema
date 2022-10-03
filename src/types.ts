type JSXNode = {
  props: {
    children?: JSXNode | [JSXNode];
    navigationKey?: string;
    id?: string;
    name?: string;
    component?: () => JSXNode;
  };
  type?: {
    name?: string;
  };
};

type CalculatedNode = {
  id?: string | number;
  type?: string;
  name?: string;
  children?: CalculatedNode[];
};

type ServerOptions = {
  port?: number;
  color?: string;
  spacing?: number;
  fontSize?: number;
  [key: string]: unknown;
};

export { JSXNode, CalculatedNode, ServerOptions };
