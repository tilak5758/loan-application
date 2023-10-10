import fs from 'fs';
import FormData from 'form-data';

async function data() {
  let form = new FormData();
  form.append('deployment-name', 'My Deployment');
  form.append('deployment-source', 'Local Node Test');
  form.append('data', fs.createReadStream('../process/process_loan.bpmn'));

  const url = 'http://localhost:8080/engine-rest/deployment/create';

  const headers = form.getHeaders();
  console.log('process start at header');


  const options:any = {
    method: 'POST',
    body: form,
    headers,
  };

  try {
    console.log('process start at try block');

    const response = await fetch(url, options);
    console.log("response",response)

    if (response.ok) {

      console.log('Deployment successful');
    } else {
      console.error('Deployment failed:', response.statusText);
    }
  } catch (err) {
    console.error(err);
  }
}

export default data()
