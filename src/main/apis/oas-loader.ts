import fs from 'fs';
import path from 'path';
import {parse} from 'yaml'
import {TApi} from '../../prompts/api-to-icl-examples';

export async function loadOasSpec(api: TApi) {
  switch (api) {
    case "spotify":
      const filePath = path.join(__dirname, './oas/spotify-oas.yaml');
      if (!fs.existsSync(filePath))
        throw new Error('cant find file');
      const yamlString = fs.readFileSync(filePath, 'utf8');
      const oas = parse(yamlString, {});
      return oas;
  }
}