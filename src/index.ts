import { getJSONNodes, sendJSONData } from './jsonNodes';

const createNavigationSchema = async (NavigationComponent: () => JSX.Element) => {
  if (!__DEV__) {
    return;
  }

  const nodes = await getJSONNodes(NavigationComponent);
  await sendJSONData(nodes);
};

export { createNavigationSchema };
