import Toast from 'react-bootstrap/Toast';
import React from 'react';
import ToastContainer from 'react-bootstrap/ToastContainer';
import styled from 'styled-components';

const Div = styled.div`
  display: flex;
  align-items: center;
`

const Button = styled.button`
  margin-left: auto;
  margin-right: 0;
`

function Toasts() {
  return (
    <ToastContainer position="top-end" className="p-3" style={{zIndex: 1}}>
      <Toast bg={"secondary"}>
        <Toast.Header>
          <strong className="me-auto">Approval Needed</strong>
          <small>11 mins ago</small>
        </Toast.Header>
        <Toast.Body>
          <Div>
            <span className={"text-highlight"}><span>GET</span> /search?q=Nicki+Minaj</span>
            <Button>Approve</Button>
          </Div>
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
}

export default Toasts;