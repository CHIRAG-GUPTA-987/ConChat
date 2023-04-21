import React, { useState } from "react";
import {
  Button,
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

const DeleteGroupChat = ({ children, overlay, user, closeContext, chat }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loadingGroup, setLoadingGroup] = useState(false);
  const { setSelectedChat, chats, setChats } = ChatState();
  const toast = useToast();
  const deleteGroupHandler = async () => {
    setLoadingGroup(true);
    if (chat.groupAdmin._id !== user.id) {
      toast({
        title: "Unable to process request at the moment",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoadingGroup(false);
      return;
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.authToken}`,
        },
      };
      const url = `${process.env.REACT_APP_BACKENDURL}/api/chat/group/kill`;
      const { data } = await axios.delete(url, {
        headers: config.headers,
        data: { chatId: chat._id },
      });
      setSelectedChat(null);
      const chatsAfterDeletion = chats.filter((chat) => chat._id !== data._id);
      setChats([...chatsAfterDeletion]);
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
    }
    onClose();
    setLoadingGroup(false);
    closeContext();
  };
  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <span onClick={onOpen}>Delete</span>
      )}
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        {overlay}
        <ModalContent>
          <ModalHeader>Bhai Kya Kar Rha Hai Tu</ModalHeader>
          <ModalBody>Are you sure you wanna delete the group</ModalBody>
          <ModalFooter display={"flex"} justifyContent={"space-between"}>
            <Button
              onClick={deleteGroupHandler}
              variant="solid"
              colorScheme={"red"}
              isLoading={loadingGroup}
              width={"73%"}
            >
              Delete Group
            </Button>
            <Button
              colorScheme="yellow"
              variant={"outline"}
              width={"25%"}
              onClick={() => {
                onClose();
                closeContext();
              }}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DeleteGroupChat;
