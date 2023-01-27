import fs from 'fs';
import { execSync } from 'child_process';

export class EnvBuilder {
    #env;
    #clusterName;

    constructor(clusterName) {
        this.#clusterName = clusterName;
    }

    createEnv() {
        const envExample = fs.readFileSync('./source/env.example.json');

        this.#env = JSON.parse(envExample, (key, value) => {

            if (String(key).includes('SECRET') && String(key) != 'AWS_SECRET_ACCESS_KEY') {

                return this.generateSecretKey();

            } else if (String(value).includes('ClusterName')) {

                return value.replace('ClusterName', this.#clusterName);
            }

            return value;
        });
    }

    generateSecretKey() {
        return execSync('uuidgen').toString().trim().replace('\n', '');
    }

    getEnv() {
        return this.#env;
    }
}
