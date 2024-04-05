import {Header} from '../wrapper/header';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

export function Home() {
  return (
    <Container>
      <Header/>
      <div>
        <h1>Welcome to the Home page!</h1>
      </div>
    </Container>
  );
}