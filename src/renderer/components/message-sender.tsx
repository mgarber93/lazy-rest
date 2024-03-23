import React, {useCallback, useState} from 'react';
import {StyledDiv} from '../styled/message';
import {useAppDispatch} from '../features/store';
import {autoPrompt} from '../features/chat';
import {useCurrentConversation} from '../hooks/current-conversation';


const MessageSender = () => {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const dispatch = useAppDispatch();
  const conversation = useCurrentConversation();
  
  const handleMouseOver = useCallback(() => {
    !clicked && setHovered(true);
  }, [clicked]);
  const handleMouseLeave = useCallback(() => {
    !clicked && setHovered(false);
  }, [clicked]);
  const handleMouseUpCapture = useCallback(() => {
    // submit last message to selected responder
    setClicked(true);
    dispatch(autoPrompt({conversationId: conversation?.id}));
  }, [dispatch, conversation]);
  return (
    <StyledDiv onMouseEnter={handleMouseOver} onMouseLeave={handleMouseLeave} className={hovered ? 'hovered' : ''}>
      <div className={"author user"}>
        <p>
          api selector
        </p>
      </div>
      
      <div className="content">
        <button onClick={handleMouseUpCapture}>
          <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" viewBox="0 0 16 16">
            <path fillRule="evenodd"
                  d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
          </svg>
          <div>
            {
              hovered && (<p className={"response"}>
                Generate response
              </p>)
            }
          </div>
        </button>
      </div>
    </StyledDiv>
  );
};

export default MessageSender;