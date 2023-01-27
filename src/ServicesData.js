import inquirer from 'inquirer';
import { FileHelper } from './FileHelper.js';

export class ServicesData {

    #chooseMethodReceivingImage = [
        {
            type: 'confirm',
            message: 'Download data from confog.json?',
            name: 'choose',
        }
    ]

    #questionCheckbox = [
        {
            type: 'checkbox',
            message: 'Select the services ',
            name: 'services',
            choices: ['Service', 'Core', 'Sync', 'Utilities', 'Sales', 'Timeportal', 'RSM']
        }
    ]
    
    #questionClusterName = [
        {
            type: 'input',
            message: 'Enter the cluster name',
            name: 'clusterName',
        }
    ]
    
    #questionSecretCommon = [
        {
            type: 'input',
            message: 'Enter the secret common',
            name: 'secretCommon',
        }
    ]

    #questionsReceivingServiceImage = [
        {
            type: 'input',
            message: 'Enter the service image for Tenant',
            name: 'Tenant',
        },
        {
            type: 'input',
            message: 'Enter the service image for Api',
            name: 'Api',
        }
    ]

    #missingServices = {
        Sales: ['SalesApi', 'SalesApp'],
        Timeportal: ['TimeportalApi', 'TimeportalApp'],
        RSM: ['RSMApi', 'RSMApp']
    }

    #selectedImages;
    #clusterName;
    #secretCommon;
    #services;

    async chooseMethodReceivingImage() {
        const choose = await inquirer.prompt(this.#chooseMethodReceivingImage)
            .then((answers) => answers.choose);

        if (choose) {
            this.#clusterName = FileHelper.readJsonParseFile('./config.json').clusterName;
            this.#secretCommon = FileHelper.readJsonParseFile('./config.json').secretCommon;
            this.#selectedImages = FileHelper.readJsonParseFile('./config.json').selectedImages;
        } else {
            await this.#requestServicesData();
        }
    }

    async #requestServicesData() {

        this.#clusterName = await inquirer.prompt(this.#questionClusterName)
            .then((answers) => answers.clusterName);

        this.#secretCommon = await inquirer.prompt(this.#questionSecretCommon)
            .then((answers) => answers.secretCommon);

        this.#services = await inquirer.prompt(this.#questionCheckbox)
            .then((answers) => answers.services);

        this.#addMissingServices();
        this.#addQuestionsForReceivingServiceImage();

        this.#selectedImages = await inquirer.prompt(this.#questionsReceivingServiceImage)
            .then((answers) => answers);

        this.#addDefaultImage();
    }

    addServicesFromConfig() {

    }

    #addMissingServices() {
        for (const service in this.#missingServices) {
            const index = this.#services.indexOf(service);
            if (index > -1) {
                this.#services.splice(index, 1);
                this.#services = this.#services.concat(this.#missingServices[service]);
            }
        }
    }

    #addQuestionsForReceivingServiceImage() {
        for (const name of this.#services) {
            const messageInputImage = `Enter the service image for ${name}`;
            const questionsInputImage = {
                type: 'input',
                message: messageInputImage,
                name: name,
            }
            this.#questionsReceivingServiceImage.push(questionsInputImage);
        }
    }

    #addDefaultImage() {
        this.#selectedImages.ApiProxy = 'master';
    }

    getClusterName() {
        return this.#clusterName;
    }

    getSecretCommon() {
        return this.#secretCommon;
    }

    getServicesImage() {
        return this.#selectedImages;
    }
}