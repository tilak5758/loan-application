// models/bpmnModel.ts
import axios from 'axios';
import FormData from 'form-data';

class BpmnModel {
  private camundaApiUrl: string;
  private username: string;
  private password: string;

  constructor() {
    this.camundaApiUrl = process.env.CAMUNDA_API_URL || 'http://localhost:8080/engine-rest';
    this.username = process.env.CAMUNDA_USERNAME || 'demo';
    this.password = process.env.CAMUNDA_PASSWORD || 'demo';
  }

  async deployBpmnProcess(bpmnFilePath: string, deploymentConfig: Record<string, any>): Promise<{ id: string; name: string }> {
    try {
    const bpmnFilePath: string = __dirname + "/../..src/process/process_loan.bpmn";
      const bpmnFileData = fs.readFileSync(bpmnFilePath);
      const authHeader = `Basic ${Buffer.from(`${this.username}:${this.password}`).toString('base64')}`;

      const formData = new FormData();
      formData.append('data', bpmnFileData, { filename: 'process_loan.bpmn' });

      for (const key in deploymentConfig) {
        if (deploymentConfig.hasOwnProperty(key)) {
          formData.append(key, deploymentConfig[key]);
        }
      }

      const response = await axios.post(`${this.camundaApiUrl}/deployment/create`, formData, {
        headers: {
          ...formData.getHeaders(),
          Authorization: authHeader,
        },
      });

      return {
        id: response.data.id,
        name: response.data.name,
      };
    } catch (error) {
      throw error;
    }
  }
}

export default BpmnModel;
