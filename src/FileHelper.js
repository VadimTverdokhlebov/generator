import fs from 'fs';
import yaml from 'js-yaml';
import schema from 'cloudformation-schema-js-yaml';

export class FileHelper {
    static readJsonParseFile(path) {
        const file = fs.readFileSync(path);
        return JSON.parse(file);
    }

    static readCloudFormationYamlParseFile(path) {
        const file = fs.readFileSync(path);
        const cloudFormationParseFile = yaml.load(file, { schema: schema });
        return cloudFormationParseFile;
    }

    static writeJsonStringify(path, obj) {
        fs.writeFileSync(path, JSON.stringify(obj));
        console.log(`${path} is recorded`);
    }

    static writeCloudFormationYamlStringify(path, obj) {
        const cloudFormationYaml = yaml.load(JSON.stringify(obj), { schema: schema });
        fs.writeFileSync(path, yaml.dump(cloudFormationYaml));

        console.log(`${path} is recorded`);
    }

    static createDirectory(dir) {
        try {
            if (!fs.existsSync(dir)){
              fs.mkdirSync(dir)
            }
          } catch (err) {
            console.error(err)
          }
    }
}