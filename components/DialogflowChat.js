import { useEffect } from "react";

export default function DialogflowChat() {
  useEffect(() => {
    // Load Dialogflow script
    const script = document.createElement("script");
    script.src =
      "https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1";
    script.async = true;
    document.body.appendChild(script);

    // Inject custom styles
    const style = document.createElement("style");
    style.innerHTML = `
      df-messenger {
        --df-messenger-bot-message: #eef2ff;
        --df-messenger-button-titlebar-color: #3b82f6;
        --df-messenger-chat-background-color: #ffffff;
        --df-messenger-font-color: #1f2937;
        --df-messenger-user-message: #dbeafe;

        position: fixed !important;
        bottom: 20px !important;
        right: 20px !important;
        z-index: 9999 !important;
        width: 350px !important;
        max-height: 500px !important;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        border-radius: 12px !important;
        overflow: hidden !important;
        margin: 0 !important;
      }

      df-messenger,
      df-messenger * {
        transition: none !important;
        animation: none !important;
        transform: none !important;
      }
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <>
      <df-messenger
        intent="WELCOME"
        chat-title="Weather Assistant"
        agent-id="c583abef-9906-4356-9faa-9f1382479b71"
        language-code="en"
      ></df-messenger>
    </>
  );
}
