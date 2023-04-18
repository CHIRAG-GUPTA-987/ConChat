import { AddIcon } from "@chakra-ui/icons";
import { Box, Button, Stack, useDisclosure, useToast } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import { Overlay2 } from "../Miscellaneous/Overlay";
import Chat from "./Chat";
import CreateGroupChat from "./GroupChats/CreateGroupChat";

const MyChats = () => {
  const [loggedUser, setLoggedUser] = useState();
  const {
    selectedChat,
    setSelectedChat,
    user,
    chats,
    setChats,
    setNotifications,
    notifications,
  } = ChatState();
  const { onOpen } = useDisclosure();
  const [overlay, setOverlay] = React.useState(<Overlay2 />);
  const toast = useToast();

  const fetchChats = async (userId) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.authToken}`,
        },
      };
      const url = `https://eatable-toothpaste-production.up.railway.app/api/chat`;
      const { data } = await axios.get(url, config);
      setChats(data);
    } catch (e) {
      toast({
        title: "Chat not found, try again later!",
        description: e.message,
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const changeSelectedChat = async (chat) => {
    setNotifications(
      notifications.filter((n) => n.newMessage.chat._id !== chat._id)
    );
    setSelectedChat(chat);
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    // eslint-disable-next-line
  }, []);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDirection="column"
      alignItems={"center"}
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius={"lg"}
      borderWidth={"1px"}
    >
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        fontFamily={"Work Sans"}
        fontSize={{ base: "26px", md: "28px" }}
        w={"100%"}
        p={2}
      >
        My Chats
        <CreateGroupChat
          onClick={() => {
            setOverlay(<Overlay2 />);
            onOpen();
          }}
          overlay={overlay}
          user={user}
          setSelectedChat={setSelectedChat}
        >
          <Button display="flex" rightIcon={<AddIcon />}>
            New Group Chat
          </Button>
        </CreateGroupChat>
      </Box>
      <Stack maxHeight={"79vh"} w={"100%"} overflow={"scroll"}>
        {chats &&
          chats.length >= 1 &&
          chats.map((chat) => (
            <Chat
              key={chat._id}
              chat={chat}
              loggedUser={loggedUser}
              setSelectedChat={setSelectedChat}
              selectedChat={selectedChat}
              changeSelectedChat={() => changeSelectedChat(chat)}
            />
          ))}
      </Stack>
    </Box>
  );
};

export default MyChats;
