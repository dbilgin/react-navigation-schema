#! /usr/bin/env node

import http from 'http';
import fs from 'fs';
import type { CalculatedNode, ServerOptions } from './types';
import nomnoml from 'nomnoml';

export const getArgs = () => {
  const args: ServerOptions = {};
  process.argv.slice(2, process.argv.length).forEach((arg) => {
    if (arg.slice(0, 2) === '--') {
      const longArg = arg.split('=');
      if (!longArg || !longArg[0]) {
        return;
      }

      const longArgFlag = longArg[0].slice(2, longArg[0].length) as keyof ServerOptions;
      const longArgValue = (longArg.length > 1 ? longArg[1] : true) as typeof longArgFlag;
      args[longArgFlag] = longArgValue;
    } else if (arg[0] === '-') {
      const flags = arg.slice(1, arg.length).split('') as [keyof ServerOptions];
      flags.forEach((flag) => {
        args[flag] = true;
      });
    }
  });
  return args;
};

const args = getArgs();

const hostname = '127.0.0.1';
const port = args.port ?? 3000;

const server = http.createServer((req, res) => {
  req.on('data', (chunks) => {
    const jsonData = JSON.parse(chunks.toString());

    if (!jsonData || !jsonData.type || !jsonData.children?.length) {
      console.log('Status: 400');
      res.statusCode = 400;
      res.end();
    }

    createJsonFile(jsonData);
    createSvgFile(jsonData);
  });

  console.log('Status: 200');
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
  let src = `#fill: ${args.color ?? '#8f8'}\n#spacing: ${args.spacing ?? 70}\n#fontSize: ${
    args.fontSize ?? 12
  }\n`;

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
