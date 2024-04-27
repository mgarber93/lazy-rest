import React, {useCallback} from "react"
import styled from 'styled-components'
import {useAppDispatch, useAppSelector} from '../features/store'
import {ContextItem} from '../features/context-menu'

const Button = styled.button`
    background-color: unset;
    border: none;
    width: 100%;
    &:hover {
        text-decoration: underline;
        background-color: var(--background-color-1);
    }
`

const ContextMenuButton = ({item}: { item: ContextItem }) => {
  const dispatch = useAppDispatch()
  const {display} = item
  const handleMouse = useCallback((e: any) => {
    if (e.target === e.currentTarget) {
      dispatch(item.action)
    }
  }, [dispatch, item])
  return <Button onMouseUpCapture={handleMouse}>{display}</Button>
}

const ContextMenu = () => {
  const {visible, x, y, items} = useAppSelector(state => state.contextMenu)
  if (!visible) {
    return null
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
        boxShadow: 'var(--shadow)',
        border: '1px solid var(--background-color-1)',
        borderRadius: 'var(--border-radius)',
        display: 'flex',
        flexDirection: 'column',
      }}>
      {
        items.map(item => <ContextMenuButton key={item.display} item={item}/>)
      }
    </div>
  )
}

export default ContextMenu