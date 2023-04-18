import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { ChatState } from "../../../Context/ChatProvider";
import GroupUsersEditor from "./GroupUsersEditor";

const UpdateGroupChat = ({ children, overlay, user, closeContext, chat }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loadingGroupName, setLoadingGroupName] = useState(false);
  const { chats, setChats } = ChatState();
  const [groupName, setGroupName] = useState(chat.chatName);
  const [groupMembers, setGroupMembers] = useState([]);
  const [updatingUsers, setUpdatingUsers] = useState(false);
  const toast = useToast();
  const updateGroupNameHandler = async () => {
    setLoadingGroupName(true);
    if (chat.groupAdmin._id !== user.id) {
      toast({
        title: "Unable to process request at the moment",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoadingGroupName(false);
      return;
    }
    if (chat.chatName === groupName) {
      toast({
        title: "Please provide a different name",
        status: "info",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoadingGroupName(false);
      return;
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.authToken}`,
        },
      };
      const url = `http://localhost:5050/api/chat/group/rename`;
      const { data } = await axios.put(
        url,
        {
          chatId: chat._id,
          chatName: groupName,
        },
        config
      );
      let chatsAfterUpdation = chats;
      chatsAfterUpdation.find((chat) => chat._id === data._id).chatName =
        data.chatName;
      setChats([...chatsAfterUpdation]);
      toast({
        title: "Group name updated successfully",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
    } catch (e) {
      if (e.response.status === 400) {
        toast({
          title: e.response.data,
          description: "Unable to process your request",
          status: "error",
          duration: 2000,
          isClosable: true,
          position: "bottom-left",
        });
      } else if (e.response.status === 401)
        toast({
          title: "You are not having access to delete this chat",
          description: e.message,
          status: "info",
          duration: 2000,
          isClosable: true,
          position: "bottom-left",
        });
      else if (e.response.status === 409)
        toast({
          title: "Naming conflict",
          description: e.response.data,
          status: "info",
          duration: 2000,
          isClosable: true,
          position: "bottom-left",
        });
    }
    setLoadingGroupName(false);
  };

  const addUserHandler = async (newUser) => {
    if (chat.groupAdmin._id !== user.id) {
      toast({
        title: "Unable to process request at the moment",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
      return;
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.authToken}`,
        },
      };
      const url = `http://localhost:5050/api/chat/group/adduser`;
      const { data } = await axios.put(
        url,
        {
          chatId: chat._id,
          userId: newUser.value,
        },
        config
      );
      let chatsAfterUpdation = chats;
      chatsAfterUpdation.find((chat) => chat._id === data._id).users =
        data.users;
      setChats([...chatsAfterUpdation]);
      setGroupMembers(data.users);
      toast({
        title: "Successfully added user to the group",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
    } catch (e) {
      if (e.response.status === 400) {
        toast({
          title: e.response.data,
          description: "Unable to process your request",
          status: "error",
          duration: 2000,
          isClosable: true,
          position: "bottom-left",
        });
      } else if (e.response.status === 401)
        toast({
          title: "You are not having access to add this user",
          description: e.message,
          status: "info",
          duration: 2000,
          isClosable: true,
          position: "bottom-left",
        });
      else if (e.response.status === 404)
        toast({
          title: "Something went wrong",
          description: e.response.data,
          status: "info",
          duration: 2000,
          isClosable: true,
          position: "bottom-left",
        });
    }
  };

  const removeUserHandler = async (gM) => {
    if (chat.users.length <= 3) {
      toast({
        title: "Group atleast contain 3 members",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
      return;
    }
    if (chat.groupAdmin._id === gM._id) {
      toast({
        title: "You can't left the group",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
      return;
    }
    if (chat.groupAdmin._id !== user.id) {
      toast({
        title: "Unable to process request at the moment",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
      return;
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.authToken}`,
        },
      };
      const url = `http://localhost:5050/api/chat/group/remove`;
      const { data } = await axios.put(
        url,
        {
          chatId: chat._id,
          userId: gM._id,
        },
        config
      );
      let chatsAfterUpdation = chats;
      chatsAfterUpdation.find((chat) => chat._id === data._id).users =
        data.users;
      setChats([...chatsAfterUpdation]);
      setGroupMembers(data.users);
      toast({
        title: "Successfully removed user from the group",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
    } catch (e) {
      toast({
        title: e.response.data || "",
        description: "Unable to process your request",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setGroupMembers(chat.users);
  }, []);

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <span onClick={onOpen}>Update</span>
      )}
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        {overlay}
        <ModalContent>
          <ModalHeader>Haan, ye karlo pehle</ModalHeader>
          <ModalBody>
            <Box
              bg="whiteAlpha.900"
              w="100%"
              p={0}
              display={"flex"}
              gap={"1rem"}
              color="black"
            >
              <Input
                variant="filled"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                width={"70%"}
              />
              <Button
                colorScheme="cyan"
                variant={"solid"}
                width={"30%"}
                onClick={updateGroupNameHandler}
                isLoading={loadingGroupName}
              >
                Update
              </Button>
            </Box>
            <GroupUsersEditor
              groupMembers={groupMembers}
              addUserHandler={addUserHandler}
              removeUserHandler={removeUserHandler}
              setUpdatingUsers={setUpdatingUsers}
            />
          </ModalBody>
          <ModalFooter display={"flex"} justifyContent={"space-between"}>
            <Button
              colorScheme="green"
              variant={"outline"}
              width={"100%"}
              onClick={() => {
                onClose();
                closeContext();
              }}
              isLoading={updatingUsers}
            >
              Done
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChat;
