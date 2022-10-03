import http from 'http';
import fs from 'fs';
import type { CalculatedNode } from './types';
import nomnoml from 'nomnoml';

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  req.on('data', (chunks) => {
    const jsonData = JSON.parse(chunks.toString());

    if (!jsonData || !jsonData.type || !jsonData.children?.length) {
      res.statusCode = 400;
      res.end();
    }

    createJsonFile(jsonData);
    createSvgFile(jsonData);
  });

  res.statusCode = 200;
  res.end();
});

server.listen(port, hostname, () => {
  console.log(`react-navigation-schema server running at http://${hostname}:${port}/`);
});

const createSvgFile = (jsonData: CalculatedNode) => {
  const svgString = createSvgString(jsonData);

  if (fs.existsSync('react-navigation-schema.svg')) {
    fs.unlinkSync('react-navigation-schema.svg');
  }

  fs.appendFileSync('react-navigation-schema.svg', nomnoml.renderSvg(svgString));
};

const createJsonFile = (jsonData: CalculatedNode) => {
  if (fs.existsSync('react-navigation-schema.json')) {
    fs.unlinkSync('react-navigation-schema.json');
  }

  fs.appendFileSync('react-navigation-schema.json', JSON.stringify(jsonData));
};

const getSvgNodeName = (element: CalculatedNode) => {
  let name = element.id;

  if (element.name) {
    name += ' - ' + element.name;
  }

  if (element.type !== 'Screen' || !element.children || element.children.length !== 1) {
    name += ' - ' + element.type;
  }

  return name;
};

const createSvgString = (jsonData: CalculatedNode) => {
  let src = '#fill: #8f8\n#spacing: 70\n#fontSize: 12\n';

  const addToSvg = (element: CalculatedNode) => {
    if (!element.children) {
      return;
    }

    for (let index = 0; index < element.children.length; index++) {
      const childElement = element.children[index];
      if (!childElement) {
        continue;
      }

      src += `[${getSvgNodeName(element)}] -> [${getSvgNodeName(childElement)}]\n`;

      if (childElement?.children) {
        addToSvg(childElement);
      }
    }
  };

  addToSvg(jsonData);

  return src;
};
