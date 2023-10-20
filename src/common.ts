

export const getCamundaApiUrl = (): string => {
    return process.env.CAMUNDA_API_URL || 'http://localhost:8080/engine-rest';
  };
  
  export const getCamundaCredentials = (): { username: string; password: string } => {
    return {
      username: process.env.CAMUNDA_USERNAME || 'demo',
      password: process.env.CAMUNDA_PASSWORD || 'demo',
    };
  };

  