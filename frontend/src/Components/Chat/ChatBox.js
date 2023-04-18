import { Avatar, Box } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { ChatState } from "../../Context/ChatProvider";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import Messages from "../Messages/Messages";

const ChatBox = () => {
  const { selectedChat, setSelectedChat, user } = ChatState();

  function getSender(users) {
    return users[0]._id === user.id ? users[1] : users[0];
  }

  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      flexDirection="column"
      alignItems={"center"}
      p={2}
      bg="white"
      w={{ base: "100%", md: "68%" }}
      borderRadius={"lg"}
      borderWidth={"1px"}
    >
      {selectedChat && (
        <Box
          display={"flex"}
          flexDirection={"row"}
          justifyContent={"space-between"}
          p={"3"}
          backgroundColor={"#e9ecef"}
          w={"100%"}
          borderRadius={"lg"}
          height={"8vh"}
          alignItems={"center"}
          fontSize={"1.2rem"}
          mb={"1"}
        >
          <Box alignItems={"center"} display={"flex"} gap={"0.5rem"}>
            <ChevronLeftIcon
              cursor={"pointer"}
              onClick={() => {
                setSelectedChat(undefined);
              }}
              boxSize={"6"}
            />
            <Avatar
              name={
                selectedChat.isGroupChat
                  ? selectedChat.chatName
                  : getSender(selectedChat.users).username
              }
              src={
                selectedChat.isGroupChat
                  ? "https://res.cloudinary.com/dxgbebpzs/image/upload/v1681378345/Conchat/gv3w82f2wtvsn2pkuni3.png"
                  : getSender(selectedChat.users).displayPicture
              }
            />
            {selectedChat.isGroupChat
              ? selectedChat.chatName
              : getSender(selectedChat.users).username}
          </Box>
        </Box>
      )}
      {selectedChat && (
        <Box
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"flex-end"}
          p={"3"}
          backgroundColor={"#e9ecef"}
          w={"100%"}
          borderRadius={"lg"}
          height={"78vh"}
          // alignItems={"center"}
          fontSize={"1.2rem"}
        >
          <Messages />
        </Box>
      )}
    </Box>
  );
};

export default ChatBox;
