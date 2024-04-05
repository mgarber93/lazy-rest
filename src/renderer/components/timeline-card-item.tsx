import {useAppDispatch} from '../features/store';
import {selectChat} from '../features/current-chat';
import {removeChat, startNewChat} from '../features/chat';
import moment from 'moment';
import {CloseButton} from 'react-bootstrap';
import {Conversation, createConversation} from '../../models/conversation';
import {useCallback} from 'react';

export function TimelineItem({item}: { item: Conversation }) {
  const dispatch = useAppDispatch();
  const handleClick = useCallback(() => {
    dispatch(selectChat(item.id))
  }, [dispatch, item])
  const handleRemoveChat = useCallback(() => {
    dispatch(removeChat(item.id))
  }, [dispatch, item])

  return <li key={item.id} className={"TimelineItem list-style-none"}>
    <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true">
      <path d="M8 4a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z"></path>
    </svg>
    <div className={"TimelineItem-body"}>
      <div className={"time"}>
        {moment(item.created).fromNow()}
        <CloseButton className={"right-align-button"} onClick={handleRemoveChat}/>
      </div>
      <a onClick={handleClick}>{item.content?.[0]?.message || item.id}</a>
    </div>
  </li>
}

export function TimelineExtend() {
  const dispatch = useAppDispatch();
  const handleClick = useCallback(() => {
    const item = createConversation('new');
    dispatch(startNewChat());
    dispatch(selectChat(item.id))
  }, [dispatch])
  return <li className={"TimelineItem list-style-none"}>
    <div className={"TimelineItem-body extend time"}>
      <a onClick={handleClick}>new</a>
    </div>
  </li>
}