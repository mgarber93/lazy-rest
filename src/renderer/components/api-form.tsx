import {SetStateAction, useState} from 'react';
import {Control, Footer, Form, Label} from '../styled/form';
import {Button} from '../styled/button';

export function ApiForm() {
  const [name, setName] = useState('')
  const [baseUrl, setBaseUrl] = useState('')
  const [clientId, setClientId] = useState('')
  const [clientSecret, setClientSecret] = useState('')

  return <Form>
    <Label>Api swagger</Label>
    <Control type="file" accept=".json, .yaml" placeholder="Swagger OAS file"
             onChange={(event: {
               target: { value: SetStateAction<string>; };
             }) => setClientSecret(event.target.value)}/>
    
    <Label>Name</Label>
    <Control type="text" placeholder="Api name (eg spotify)" value={name}
             onChange={(event: {
               target: { value: SetStateAction<string>; };
             }) => setName(event.target.value)}/>

    <Label>Base URL</Label>
    <Control type="text" placeholder="Base URL" value={baseUrl}
             onChange={(event: {
               target: { value: SetStateAction<string>; };
             }) => setBaseUrl(event.target.value)}/>

    <Label>Client ID</Label>
    <Control type="text" placeholder="Client ID" value={clientId}
             onChange={(event: {
               target: { value: SetStateAction<string>; };
             }) => setClientId(event.target.value)}/>

    <Label>Client Secret</Label>
    <Control type="text" placeholder="Client secret" value={clientSecret}
             onChange={(event: {
               target: { value: SetStateAction<string>; };
             }) => setClientSecret(event.target.value)}/>

    <Footer>
      <Button type="submit">Save</Button>
    </Footer>
  </Form>;
}