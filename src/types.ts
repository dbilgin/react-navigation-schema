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

export { JSXNode, CalculatedNode };
