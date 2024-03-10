import styled from 'styled-components';
import {ChangeEventHandler} from 'react';

const Selecter = styled.select`
    border-bottom-right-radius: 0;
    border-top-right-radius: 0;
    width: var(--name-gutter);
    -webkit-appearance: none;
    -moz-appearance: none;
    text-indent: 1px;
    color: var(--dark-grey);
    height: 100%;
    margin-left: 4px;
    margin-right: auto;
    transition: 200ms box-shadow ease-in-out;
    font-size: var(--bs-body-font-size);
    margin-top: auto;
    background-color: var(--background-color-1);
    padding: 0.3rem 0.5rem 0.3rem 0.5rem;
    outline: none;
    border-right: 1px solid var(--background-color-1);
    box-shadow: 0.25rem 0.15rem var(--box-shadow-background);
    border: 1px solid var(--box-shadow-background);
    border-right: 1px solid var(--background-color-1);
    border-top-left-radius: var(--border-radius);
    border-bottom-left-radius: var(--border-radius);
`

export function MessageRoleSelector(props: {
  handleChange: ChangeEventHandler,
  role: string,
  currentUser: string,
  roles: { value: string, display: string }[]
}) {
  const {role, handleChange, currentUser, roles} = props;
  return (
    <Selecter value={role} onChange={handleChange} disabled={roles.length === 1}>
      {roles.map(r => <option key={r.display} value={r.value}>{r.display}</option>)}
    </Selecter>
  );
}