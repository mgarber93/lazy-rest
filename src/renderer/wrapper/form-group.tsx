import styled from 'styled-components';
import {Card} from './card';
import {ApiForm} from '../components/api-form';

export const Section = styled.section`
  padding: 1rem;

  .flex-row {
    display: flex;
    flex-direction: row;
  }

  .card {
    max-width: 600px;
  }

  section {
    display: flex;
    flex-direction: column;
  }

  &.blur {
    filter: blur(1px);
  }

  *.background {
    position: absolute;
  }

  &.primary {
    background-color: rgba(112, 128, 144, 0.3); // rgba for slategray
  }

  &.secondary {
    background-color: #729EA120;
  }

  &.tertiary {
    background-color: rgba(223, 190, 153, 0.15);
  }
`;

export function ApiIntegration(props: { background: string }) {
  return <Section className={`p-5 ${props.background}`}>
    <div>
      <div className="flex-row">
        <Card>
          <ApiForm/>
        </Card>
      </div>
    </div>
  </Section>;
}