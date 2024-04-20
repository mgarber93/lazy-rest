import {Button, Form} from 'react-bootstrap';
import {useState} from 'react';

export function ApiForm() {
  const [name, setName] = useState('')
  const [baseUrl, setBaseUrl] = useState('')
  const [clientId, setClientId] = useState('')
  const [clientSecret, setClientSecret] = useState('')

  return <Form>
    <h5>{name}</h5>
    <Form.Label>Name</Form.Label>
    <Form.Control type="text" placeholder="Api name (eg spotify)" value={name}
                  onChange={event => setName(event.target.value)}/>

    <Form.Label>Base URL</Form.Label>
    <Form.Control type="text" placeholder="Base URL" value={baseUrl}
                  onChange={event => setBaseUrl(event.target.value)}/>

    <Form.Label>Client ID</Form.Label>
    <Form.Control type="text" placeholder="Client ID" value={clientId}
                  onChange={event => setClientId(event.target.value)}/>

    <Form.Label>Client Secret</Form.Label>
    <Form.Control type="text" placeholder="Client secret" value={clientSecret}
                  onChange={event => setClientSecret(event.target.value)}/>

    <Form.Label>Api swagger</Form.Label>
    <Form.Control type="file" placeholder="Swagger OAS file"
                  onChange={event => setClientSecret(event.target.value)}/>

    <div className="d-flex justify-content-center">
      <Button variant="primary" type="submit" size={"sm"}>Submit</Button>
    </div>
  </Form>;
}