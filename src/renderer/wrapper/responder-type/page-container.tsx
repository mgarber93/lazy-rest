import styled from 'styled-components';
import {ReactNode} from 'react';
import {Header} from '../header';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

export function PageContainer(props: { children: ReactNode }) {
  return (
    <Container>
      <Header/>
      {props.children}
    </Container>
  );
}