import { message } from "antd";

export default function showMessage(msgType, msgContent) {
  message.config({
    maxCount: 1,
  });

  message[msgType]({
    content: msgContent,
    className: "event-message",
    duration: 5,
    maxCount: 1,
  });
}
