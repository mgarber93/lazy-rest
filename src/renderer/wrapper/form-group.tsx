import styled from 'styled-components';

const Section = styled.section`
`;

export function FormGroup(props: {name: string, children: React.ReactNode}) {
  return <Section className="provider">
    <h4>{props.name}</h4>
    <div className="flex-row provider">
      {props.children}
    </div>
  </Section>
}