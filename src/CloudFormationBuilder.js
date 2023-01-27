import { FileHelper } from './FileHelper.js';

export class CloudFormationBuilder {
    #cloudFormation = {
        AWSTemplateFormatVersion: '2010-09-09'
    }
    #allServices = {
        Tenant: 'tenant',
        Api: 'api',
        ApiProxy: 'api-proxy',
        Service: 'service-app',
        Core: 'core',
        Sync: 'sync',
        Utilities: 'utilities',
        SalesApi: 'sales-api',
        SalesApp: 'sales-app',
        TimeportalApi: 'timeportal-api',
        TimeportalApp: 'timeportal-app',
        RSMApi: 'rsm-api',
        RSMApp: 'rsm-app'
    }
    #images = {};
    #services = {};
    #selectedImages = {};

    constructor(selectedImages) {
        this.#selectedImages = selectedImages;
    }

    createImagesAndServices() {
        for (const [imageParameter, serviceName] of Object.entries(this.#allServices)) {

            if (imageParameter in this.#selectedImages) {

                this.#createImage(serviceName, imageParameter);

                this.#createService(serviceName, imageParameter);
            }
        }
    }

    #createImage(serviceName, imageParameter) {
        const imageName = this.#selectedImages[imageParameter];

        this.#images['Image' + imageParameter] = {
            Type: 'String',
            Default: `863482225243.dkr.ecr.eu-central-1.amazonaws.com/${serviceName}/${imageName}:latest`,
        }
    }

    #createService(serviceName, imageParameter) {
        this.#services['ServiceName' + imageParameter] = {
            Type: 'String',
            Default: serviceName,
        }
    }

    addParameters() {
        const defaultParametrsBegin = FileHelper
            .readCloudFormationYamlParseFile('./source/templatesYaml/defaultParametrsBegin.yml');

        const defaultParametrsEnd = FileHelper
            .readCloudFormationYamlParseFile('./source/templatesYaml/defaultParametrsEnd.yml');

        this.#cloudFormation.Parameters = Object.assign(defaultParametrsBegin, this.#images, this.#services, defaultParametrsEnd);
    }

    addResources() {

        this.#addDefaultResources();

        for (const parameter of Object.keys(this.#allServices)) {
            if (parameter in this.#selectedImages) {
                const resources = FileHelper
                    .readCloudFormationYamlParseFile(`./source/templatesYaml/resources/${parameter}.yml`);

                Object.assign(this.#cloudFormation.Resources, resources);
            }
        }
    }

    #addDefaultResources() {
        const path = './source/templatesYaml/resources/defaultResources.yml';
        this.#cloudFormation.Resources = FileHelper.readCloudFormationYamlParseFile(path);
    }

    addOutputs() {
        const defaultOutputs = FileHelper
            .readCloudFormationYamlParseFile('./source/templatesYaml/defaultOutputs.yml');
        this.#cloudFormation.Outputs = defaultOutputs;
    }

    getCloudFormation() {
        return this.#cloudFormation;
    }
}
