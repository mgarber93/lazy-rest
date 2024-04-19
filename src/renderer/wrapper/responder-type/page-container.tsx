import styled from 'styled-components';
import {ReactNode} from 'react';
import {Header} from '../header';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: 100vh;
  overflow-y: hidden;
  background: linear-gradient(var(--background-color-0), var(--background-color-1) 45%);
`

export function PageContainer(props: { children: ReactNode, activeRoute: string }) {
  return (
    <Container>
      <Header activeRoute={props.activeRoute}/>
      {props.children}
    </Container>
  );
}