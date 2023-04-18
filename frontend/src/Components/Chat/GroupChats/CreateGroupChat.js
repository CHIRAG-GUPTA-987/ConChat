import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  IconButton,
  VStack,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import axios from "axios";
import { ChatState } from "../../../Context/ChatProvider";
import Select from "react-select";

const CreateGroupChat = ({
  children,
  overlay,
  user: loggedUser,
  setSelectedChat,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loadingGroup, setLoadingGroup] = useState();
  const [groupName, setGroupName] = useState("");
  const [groupUsers, setGroupUsers] = useState([]);
  const { setChats, chats } = ChatState();
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const toast = useToast();

  const searchUsers = async (sq) => {
    setLoadingGroup(true);
    if (sq) {
      try {
        const config = {
          headers: {
            authorization: `Bearer ${loggedUser.authToken}`,
          },
        };
        const url = `http://localhost:5050/api/user?search=${sq}`;
        const { data } = await axios.get(url, config);
        let options = [];
        for (let d of data) {
          options.push({
            value: d._id,
            label: `${d.username} | ${d.firstName}`,
          });
        }
        setSearchedUsers(options);
      } catch (e) {
        toast({
          title: "Users not found",
          status: "error",
          duration: 2000,
          isClosable: true,
          position: "bottom-left",
        });
      }
    } else {
      setSearchedUsers(
        chats
          .filter((chat) => chat.isGroupChat === false)
          .map((chat) =>
            chat.users[0]._id === loggedUser.id
              ? {
                  value: chat.users[1]._id,
                  label: `${chat.users[1].username} | ${chat.users[1].firstName}`,
                }
              : {
                  value: chat.users[0]._id,
                  label: `${chat.users[0].username} | ${chat.users[0].firstName}`,
                }
          )
      );
    }
    setLoadingGroup(false);
  };

  const changeSearchQuery = async (e) => {
    setSearchQuery(e.target.value);
  };

  const createGroupHandler = async () => {
    setLoadingGroup(true);
    if (groupName === null || groupName === "" || groupName === undefined) {
      toast({
        title: "Group name not found",
        description: `Name your group`,
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoadingGroup(false);
      return;
    }
    if (groupUsers.length < 2) {
      toast({
        title: "Group must contain at least 3 users",
        description: `Users provided: ${groupUsers.length + 1} (including you)`,
        status: "info",
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
          Authorization: `Bearer ${loggedUser.authToken}`,
        },
      };
      const url = `http://localhost:5050/api/chat/group/new`;
      const { data } = await axios.post(
        url,
        {
          users: JSON.stringify(groupUsers),
          groupName: groupName,
        },
        config
      );
      setSelectedChat(data);
      setChats([data, ...chats]);
    } catch (e) {
      if (e.response.status === 409) {
        toast({
          title: e.response.data,
          description: "Try providing some other name to your group",
          status: "error",
          duration: 2000,
          isClosable: true,
          position: "bottom-left",
        });
      } else
        toast({
          title: "Chat not found, try again later!",
          description: e.message,
          status: "error",
          duration: 2000,
          isClosable: true,
          position: "bottom-left",
        });
    }
    onClose();
    setLoadingGroup(false);
  };

  const updatedGroupUsers = async (e) => {
    setLoadingGroup(true);
    let gUsers = [];
    for (let event of e) {
      gUsers.push(event.value);
    }
    setGroupUsers(gUsers);
    setLoadingGroup(false);
  };

  useEffect(() => {
    setSearchedUsers(
      chats
        .filter((chat) => chat.isGroupChat === false)
        .map((chat) =>
          chat.users[0]._id === loggedUser.id
            ? {
                value: chat.users[1]._id,
                label: `${chat.users[1].username} | ${chat.users[1].firstName}`,
              }
            : {
                value: chat.users[0]._id,
                label: `${chat.users[0].username} | ${chat.users[0].firstName}`,
              }
        )
    );
  }, [chats]);

  useEffect(() => {
    searchUsers(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    console.log(searchedUsers);
  }, [searchedUsers]);

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton d={{ base: "flex" }} icon={<AddIcon />} onClick={onOpen} />
      )}
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        {overlay}
        <ModalContent>
          <ModalHeader>Create group chat...</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <FormControl id="groupName" isRequired>
                <FormLabel>Group Name</FormLabel>
                <Input
                  type={"text"}
                  placeholder="Name your group"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                />
              </FormControl>
              <FormControl
                id="groupUsers"
                isRequired
                onKeyUp={changeSearchQuery}
              >
                <FormLabel>Group Users</FormLabel>
                <Select
                  isMulti
                  defaultValue={groupUsers}
                  onChange={updatedGroupUsers}
                  options={searchedUsers}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={createGroupHandler}
              variant="solid"
              colorScheme={"teal"}
              isLoading={loadingGroup}
              width={"100%"}
            >
              Create Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateGroupChat;
