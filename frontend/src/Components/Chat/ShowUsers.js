import { Stack, useToast } from "@chakra-ui/react";
import axios from "axios";
import React from "react";
import { ChatState } from "../../Context/ChatProvider";
import UserListItem from "./UserListItem";

const ShowUsers = ({ users, setLoadingChat, onClose }) => {
  const { user, setSelectedChat, chats, setChats } = ChatState();
  const toast = useToast();
  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.authToken}`,
        },
      };
      const url = `${process.env.REACT_APP_BACKENDURL}/api/chat`;
      const { data } = await axios.post(url, { userId }, config);
      if (chats && !chats.find((c) => c._id === data._id))
        setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (e) {
      toast({
        title: "Unable to talk at the moment",
        description: e.message,
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  return (
    <Stack>
      {users &&
        users.length >= 1 &&
        users.map((user) => (
          <UserListItem
            key={user._id}
            user={user}
            accessChatHandler={() => accessChat(user._id)}
          />
        ))}
    </Stack>
  );
};

export default ShowUsers;
