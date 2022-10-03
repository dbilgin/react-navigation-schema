import type { CalculatedNode, JSXNode } from './types';

const getJSONNodes = async (NavConComponent: JSX.Element): Promise<CalculatedNode> => {
  let id = 0;
  const navigationContainer = NavConComponent.props.children;

  const getChildrenNodes = (navigatorObj: JSXNode): CalculatedNode => {
    let c = navigatorObj.props.children ?? navigationChildren(navigatorObj);
    if (!!c && !Array.isArray(c)) {
      c = [c];
    }

    id++;
    return {
      id: navigatorObj.props.id ?? navigatorObj.props.navigationKey ?? id,
      type: navigatorObj.type?.name,
      name: navigatorObj.props.name,
      children: c?.map((x) => getChildrenNodes(x)),
    };
  };

  return getChildrenNodes(navigationContainer);
};

const navigationChildren = (navigatorObj: JSXNode): JSXNode[] | undefined => {
  try {
    const propComponentChildren = navigatorObj.props.component?.();
    if (!propComponentChildren) {
      return undefined;
    }

    const name = propComponentChildren?.type?.name?.toString();

    if (name !== 'Screen' && name !== 'Group' && !name?.includes('Navigator')) {
      return undefined;
    }

    return [propComponentChildren];
  } catch {
    return undefined;
  }
};

const sendJSONData = async (jsonNodes: CalculatedNode, port?: number) => {
  try {
    const rawResponse = await fetch(`http://10.0.2.2:${port ?? 3000}/`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jsonNodes),
    });

    if (rawResponse.status === 200) {
      console.log('Schema created');
    } else {
      console.log('Error creating schema');
    }
  } catch (error) {
    console.log('Error: ', error);
  }
};

export { getJSONNodes, sendJSONData };
