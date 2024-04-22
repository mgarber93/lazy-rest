import {SetStateAction, useCallback, useMemo, useState} from 'react';
import {parse} from 'yaml'
import {v4} from 'uuid';
import {Control, Footer, Form, Label} from '../styled/form';
import {Button} from '../styled/button';
import {OpenApiSpec} from '../../models/open-api-spec';
import {useAppDispatch} from '../features/store';
import {addApiConfiguration} from '../features/tools';

export function ApiForm() {
  const [name, setName] = useState('')
  const [baseUrl, setBaseUrl] = useState('')
  const [clientId, setClientId] = useState('')
  const [clientSecret, setClientSecret] = useState('')
  const [oas, setOas] = useState(null);
  const [fileHandle, setFileHandle] = useState('')
  const dispatch = useAppDispatch();
  
  const handleFile = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const yaml = parse(reader.result as string) as OpenApiSpec;
        setName(yaml.info.contact.name);
        setBaseUrl(yaml.servers[0].url);
        setOas(yaml);
        const key = v4();
        setFileHandle(key);
      };
      reader.readAsText(file);  // You can read it as Array Buffer or Binary String alternatively
    }
  }, [setName, setBaseUrl, setOas, setFileHandle, dispatch]);

  const isValid = useMemo(() => {
    return name && baseUrl && clientId && clientSecret && oas !== null;
  }, [name, baseUrl, clientId, clientSecret, oas]);

  const handleSubmit = useCallback((event: React.FormEvent) => {
    event.preventDefault();
    localStorage.setItem(fileHandle, oas);
    dispatch(addApiConfiguration({key: fileHandle, configuration: {name, baseUrl, clientId, clientSecret, fileHandle}}));
  }, [dispatch, oas, name, baseUrl, clientId, clientSecret, fileHandle]);

  return <Form onSubmit={handleSubmit}>
    <Label>Open Api Spec</Label>
    <Control type="file" accept=".json, .yaml" placeholder="Swagger OAS file"
             onChange={handleFile}/>
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
    <Control type="password" placeholder="Client ID" value={clientId}
             onChange={(event: {
               target: { value: SetStateAction<string>; };
             }) => setClientId(event.target.value)}/>
    <Label>Client Secret</Label>
    <Control type="password" placeholder="Client secret" value={clientSecret}
             onChange={(event: {
               target: { value: SetStateAction<string>; };
             }) => setClientSecret(event.target.value)}/>
    <Footer>
      <Button disabled={!isValid} type="submit">Save</Button>
    </Footer>
  </Form>;
}