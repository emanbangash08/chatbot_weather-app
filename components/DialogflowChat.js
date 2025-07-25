// components/DialogflowChat.js
import { useEffect } from 'react';

export default function DialogflowChat() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <>
      <df-messenger
  intent="WELCOME"
  chat-title="myagent"
  agent-id="c583abef-9906-4356-9faa-9f1382479b71"
  language-code="en"
></df-messenger>
    </>
  );
}
