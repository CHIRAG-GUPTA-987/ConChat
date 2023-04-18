import { Avatar, Box } from "@chakra-ui/react";
import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import Lottie from "react-lottie";
import { ChatState } from "../../Context/ChatProvider";
import typingIndicatorJson from "../Miscellaneous/typingindicator.json";

const ScrollableChats = ({ messages, isTyping }) => {
  const { user, selectedChat } = ChatState();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: typingIndicatorJson,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const isLastMessage = (index) => {
    if (index === messages.length - 1) return true;
    return messages[index].sender._id !== messages[index + 1].sender._id;
  };

  const isFirstMessage = (index) => {
    if (index === 0) return true;
    return messages[index].sender._id !== messages[index - 1].sender._id;
  };

  const messageTime = (t) => {
    const d = new Date(t);
    const hour =
      d.getHours() > 11
        ? d.getHours() - 12 < 10
          ? `0${d.getHours() - 12}`
          : d.getHours() - 12
        : d.getHours() === 0
        ? 12
        : d.getHours() < 10
        ? `0${d.getHours()}`
        : d.getHours();
    const minutes = d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes();
    return `${hour}:${minutes} ${d.getHours() > 11 ? "pm" : "am"}`;
  };

  const isDateChanged = (index) => {
    if (index === 0) return true;
    const prevDate = new Date(messages[index - 1].createdAt);
    const currDate = new Date(messages[index].createdAt);
    return (
      prevDate.getDate() !== currDate.getDate() ||
      prevDate.getMonth() !== currDate.getMonth() ||
      prevDate.getFullYear() !== currDate.getFullYear()
    );
  };

  const findDay = (d) => {
    switch (d) {
      case 0:
        return "Sunday";
      case 1:
        return "Monday";
      case 2:
        return "Tuesday";
      case 3:
        return "Wednesday";
      case 4:
        return "Thursday";
      case 5:
        return "Friday";
      case 6:
        return "Saturday";
    }
  };

  const findDate = (t) => {
    const d = new Date(t);
    const currDate = new Date();
    if (
      d.getDate() === currDate.getDate() &&
      d.getMonth() === currDate.getMonth() &&
      d.getFullYear() === currDate.getFullYear()
    )
      return "Today";
    if (
      d.getDate() === currDate.getDate() - 1 &&
      d.getMonth() === currDate.getMonth() &&
      d.getFullYear() === currDate.getFullYear()
    )
      return "Yesterday";
    if (
      currDate.getDate() - d.getDate() <= 7 &&
      d.getMonth() === currDate.getMonth() &&
      d.getFullYear() === currDate.getFullYear()
    )
      return findDay(d.getDay());
    const date = d.getDate() < 10 ? `0${d.getDate()}` : d.getDate();
    const month = d.getMonth() + 1 < 10 ? `0${d.getMonth()}` : d.getMonth();
    return `${date}/${month}/${d.getFullYear()}`;
  };

  return (
    <Box h={"100%"} w={"100%"} overflow={"scroll"}>
      <ScrollableFeed>
        {messages &&
          messages.map((message, i) => (
            <div key={message._id}>
              {isDateChanged(i) && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: "0.2rem",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "#4a4e69",
                      color: "#edf2f4",
                      padding: "0.2rem 0.5rem",
                      borderRadius: "0.5rem",
                    }}
                  >
                    {findDate(message.createdAt)}
                  </div>
                </div>
              )}
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    message.sender._id === user.id ? "flex-end" : "flex-start",
                  marginBottom: "0.2rem",
                  alignItems: "flex-end",
                }}
              >
                {message.sender._id !== user.id && isLastMessage(i) ? (
                  <Avatar
                    size="xs"
                    name="Dan Abrahmov"
                    src={message.sender.displayPicture}
                    marginRight={"2px"}
                  />
                ) : (
                  <span style={{ marginRight: "27px" }}></span>
                )}
                <div
                  style={{
                    backgroundColor:
                      message.sender._id === user.id ? "#8e9aaf" : "#68b0ab",
                    color: "white",
                    padding: "0.2rem 0.5rem",
                    borderRadius: isFirstMessage(i)
                      ? message.sender._id !== user.id
                        ? "0 0.5rem 0.5rem 0.5rem"
                        : "0.5rem 0 0.5rem 0.5rem"
                      : "0.5rem",
                    maxWidth: "75%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems:
                      message.sender._id !== user.id
                        ? "flex-start"
                        : "flex-end",
                    textAlign: "justify",
                  }}
                >
                  {selectedChat.isGroupChat &&
                    message.sender._id !== user.id && (
                      <div style={{ fontSize: "0.8rem" }}>
                        ~
                        {message.sender.username.length >= 20
                          ? message.sender.username.slice(0, 20) + "..."
                          : message.sender.username}
                      </div>
                    )}
                  {message.content}
                  <div
                    style={{
                      color: "#e5e5e5",
                      width: "100%",
                      display: "flex",
                      justifyContent: "flex-end",
                      fontSize: "0.7rem",
                    }}
                  >
                    {messageTime(message.createdAt)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        {isTyping && (
          <div style={{ width: "fit-content" }}>
            <Lottie
              width={""}
              style={{
                width: "50px",
                display: "flex",
                justifyContent: "flex-start",
              }}
              options={defaultOptions}
            />
          </div>
        )}
      </ScrollableFeed>
    </Box>
  );
};

export default ScrollableChats;
