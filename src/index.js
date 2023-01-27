import { FileHelper } from "./FileHelper.js";
import { ServicesData } from "./ServicesData.js";
import { CloudFormationBuilder } from "./CloudFormationBuilder.js";
import { EnvBuilder } from './EnvBuilder.js';

main();

async function main() {
    const dataServices = new ServicesData();
    await dataServices.chooseMethodReceivingImage();

    const selectedImages = dataServices.getServicesImage();
    const clusterName = dataServices.getClusterName();
    const secretCommon = dataServices.getSecretCommon();

    const cloudFormation = new CloudFormationBuilder(selectedImages, clusterName, secretCommon);
    cloudFormation.createImagesAndServices();
    cloudFormation.addParameters();
    cloudFormation.addResources();
    cloudFormation.addOutputs();
    
    FileHelper.createDirectory('../result');
    FileHelper.createDirectory(`../result/${clusterName}`);

    FileHelper.writeJsonStringify(`../result/${clusterName}/cloudformation.json`, cloudFormation.getCloudFormation());
    FileHelper.writeCloudFormationYamlStringify(`../result/${clusterName}/cloudformation.yml`, cloudFormation.getCloudFormation());

    const env = new EnvBuilder(clusterName);
    env.createEnv();

    FileHelper.writeJsonStringify(`../result/${clusterName}/env.json`, env.getEnv());

}
