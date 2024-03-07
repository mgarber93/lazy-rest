import React from "react";
import {useAppSelector} from '../features/store';
import styled from 'styled-components';


const ContextMenuButton = styled.button`
    background-color: unset;
    border: none;

    &:hover {
        text-decoration: underline;
    }
`;


const ContextMenu = () => {
  const {visible, x, y, items} = useAppSelector(state => state.contextMenu)
  if (!visible) {
    return null;
  }
  return (
    <div
      style={{
        height: 'auto',
        backgroundColor: 'var(--background-color-2)',
        position: 'absolute',
        top: y,
        left: x,
        padding: '0.2rem',
        boxShadow: '0rem 0.3rem 0.3rem var(--background-color-0)',
        border: '1px solid #fff0',
        borderRadius: '0.5rem',
        display: 'flex',
        flexDirection: 'column',
      }}>
      {
        items.map(item => <ContextMenuButton key={item}>{item}</ContextMenuButton>)
      }
    </div>
  )
};

export default ContextMenu;