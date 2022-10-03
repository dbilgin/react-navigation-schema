import { getJSONNodes, sendJSONData } from './jsonNodes';

const createNavigationSchema = async (NavigationComponent: () => JSX.Element, port?: number) => {
  if (!__DEV__) {
    return;
  }

  const nodes = await getJSONNodes(NavigationComponent);
  await sendJSONData(nodes, port);
};

export { createNavigationSchema };
