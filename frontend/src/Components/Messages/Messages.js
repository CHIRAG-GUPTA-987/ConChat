import { FormControl, Input, Spinner, useToast } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";
import ScrollableChats from "../Chat/ScrollableChats";
import io from "socket.io-client";

let socket, selectedChatCompare;

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnection, setSocketConnection] = useState(false);
  const [typingIndicator, setTypingIndicator] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const { user, selectedChat, notifications, setNotifications } = ChatState();
  const toast = useToast();

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.authToken}`,
        },
      };
      const url = `${process.env.REACT_APP_BACKENDURL}/api/message/fetch`;
      const { data } = await axios.get(`${url}/${selectedChat._id}`, config);
      setMessages(data);
      socket.emit("Join Chat", selectedChat._id);
    } catch (e) {
      if (e.response.status === 400) {
        toast({
          title: e.response.data,
          status: "error",
          duration: 2000,
          isClosable: true,
          position: "top-right",
          variant: "left-accent",
        });
      } else
        toast({
          title: "Something went wrong",
          description: e.message,
          status: "error",
          duration: 2000,
          isClosable: true,
          position: "top-right",
          variant: "left-accent",
        });
    }
    setLoading(false);
  };

  const sendMessage = async (e) => {
    if (e.key === "Enter") {
      if (newMessage) {
        try {
          setTypingIndicator(false);
          const latestMessage = newMessage;
          setNewMessage("");
          const config = {
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${user.authToken}`,
            },
          };
          const url = `${process.env.REACT_APP_BACKENDURL}/api/message`;
          const { data } = await axios.post(
            url,
            {
              chatId: selectedChat._id,
              content: latestMessage,
            },
            config
          );
          socket.emit("New Message", data);
          setMessages([...messages, data]);
        } catch (e) {
          if (e.response.status === 400) {
            toast({
              title: e.response.data,
              status: "error",
              duration: 2000,
              isClosable: true,
              position: "top-right",
              variant: "left-accent",
            });
          } else
            toast({
              title: "Something went wrong",
              description: e.message,
              status: "error",
              duration: 2000,
              isClosable: true,
              position: "top-right",
              variant: "left-accent",
            });
        }
      } else {
        toast({
          title: "Message not provided",
          description: "Unable to send empty messages",
          status: "warning",
          duration: 2000,
          isClosable: true,
          variant: "left-accent",
          position: "top-right",
        });
      }
    }
  };

  const typingHandler = async (e) => {
    setNewMessage(e.target.value);
    if (!socketConnection) return;
    if (!typingIndicator) {
      setTypingIndicator(true);
      socket.emit("Typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    let timerLength = 3000;
    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typingIndicator) {
        socket.emit("Stop Typing", selectedChat._id);
        setTypingIndicator(false);
      }
    }, timerLength);
  };

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);

  useEffect(() => {
    socket = io(process.env.REACT_APP_BACKENDURL);
    socket.emit("setup", user);
    socket.on("connected", () => {
      setSocketConnection(true);
    });
    socket.on("typing", () => {
      setIsTyping(true);
    });
    socket.on("stop typing", () => {
      setIsTyping(false);
    });
  }, []);

  useEffect(() => {
    socket.on("Message Recieved", (newMessageRecieved) => {
      if (selectedChat._id === newMessageRecieved.chat._id) {
        console.log("hello");
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  return (
    <>
      {loading && (
        <Spinner
          size={"xl"}
          boxSize={"20"}
          speed="0.7s"
          thickness="0.2rem"
          color="blackAlpha.500"
          alignSelf={"center"}
          margin={"auto"}
        />
      )}
      {!loading && <ScrollableChats messages={messages} isTyping={isTyping} />}
      <FormControl onKeyDown={sendMessage} width={"100%"} h={"5vh"} mt={"3"}>
        <Input
          value={newMessage}
          variant={"filled"}
          type="text"
          placeholder="Enter your message"
          p={"4"}
          borderWidth={"2px"}
          borderStyle={"solid"}
          borderColor={"blackAlpha.100"}
          onChange={typingHandler}
        />
      </FormControl>
    </>
  );
};

export default Messages;
