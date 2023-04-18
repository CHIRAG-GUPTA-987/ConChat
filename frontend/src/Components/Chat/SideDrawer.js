import {
  Box,
  Tooltip,
  Button,
  Text,
  Menu,
  MenuButton,
  Avatar,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  Drawer,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerOverlay,
  Input,
  useToast,
  Spinner,
  Center,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { BellIcon, ChevronDownIcon, Search2Icon } from "@chakra-ui/icons";
import { ChatState } from "../../Context/ChatProvider";
import Profile from "../Auth/Profile";
import Overlay from "../Miscellaneous/Overlay";
import { useHistory } from "react-router-dom";
import { Logout } from "../Auth/Logout";
import ChatLoading from "./ChatLoading";
import axios from "axios";
import ShowUsers from "./ShowUsers";
import { Effect } from "react-notification-badge";
import NotificationBadge from "react-notification-badge/lib/components/NotificationBadge";
import io from "socket.io-client";

const ENDPOINT = "https://eatable-toothpaste-production.up.railway.app";
let socket;

const SideDrawer = () => {
  const { onOpen, isOpen, onClose } = useDisclosure();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [overlay, setOverlay] = React.useState(<Overlay />);
  const {
    user,
    notifications,
    setNotifications,
    setSelectedChat,
    selectedChat,
  } = ChatState();
  const history = useHistory();
  const drawerRef = React.useRef();
  const toast = useToast();

  const searchUsers = async (...source) => {
    setLoading(true);
    if (search) {
      try {
        const config = {
          headers: {
            authorization: `Bearer ${user.authToken}`,
          },
        };
        const url = `https://eatable-toothpaste-production.up.railway.app/api/user?search=${search}`;
        const { data } = await axios.get(url, config);
        setSearchResult(data);
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
      setSearchResult([]);
      if (source[0] !== 1) {
        toast({
          title: "Provide name of user to search",
          status: "warning",
          duration: 2000,
          isClosable: true,
          position: "bottom-left",
        });
      }
    }
    setLoading(false);
  };

  const setSearchAndsearchUsers = async (e) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
  }, []);

  useEffect(() => {
    searchUsers(1);
    // eslint-disable-next-line
  }, [search]);

  useEffect(() => {
    setSearchResult([]);
  }, [loadingChat]);

  useEffect(() => {
    socket.on("Message Recieved", (newMessageRecieved) => {
      if (!selectedChat || selectedChat._id !== newMessageRecieved.chat._id) {
        let nfs = notifications.slice();
        console.log(nfs.length, notifications.length);
        let ind = nfs.findIndex((nf) => {
          console.log("index", nf);
          return nf.newMessage.chat._id == newMessageRecieved.chat._id;
        });
        if (ind === -1) {
          setNotifications([
            {
              newMessage: {
                chat: newMessageRecieved.chat,
                sender: newMessageRecieved.sender,
              },
              messageCount: 1,
            },
            ...notifications,
          ]);
        } else {
          nfs[ind].messageCount += 1;
          setNotifications(nfs);
        }
      }
    });
  });

  return (
    <>
      <Box
        display={"flex"}
        justifyContent="space-between"
        alignItems={"center"}
        bg="white"
        w={"100%"}
        p={"5px 10px 5px 10px"}
        borderWidth={"5px"}
      >
        <Tooltip label="Search users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen} ref={drawerRef}>
            <Search2Icon />
            <Text display={{ base: "none", md: "flex" }} px="4">
              Search User
            </Text>
          </Button>
        </Tooltip>

        <Text fontFamily={"Rubik Iso"} fontSize={"2rem"}>
          ConChat
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <NotificationBadge
                count={notifications.length}
                effect={Effect.SCALE}
              />
              <BellIcon boxSize={6} />
            </MenuButton>
            <MenuList>
              {!notifications.length && (
                <MenuItem key={0}>No new notification</MenuItem>
              )}
              {notifications.map((notification) => {
                return (
                  <MenuItem
                    key={notification._id}
                    onClick={() => {
                      setSelectedChat(notification.newMessage.chat);
                      let nf = notifications.filter(
                        (n) =>
                          n.newMessage.chat._id !==
                          notification.newMessage.chat._id
                      );
                      setNotifications(nf);
                    }}
                  >
                    {notification.newMessage.chat.isGroupChat
                      ? notification.newMessage.chat.chatName
                      : notification.newMessage.sender.username}
                    {` (${notification.messageCount} new message${
                      notification.messageCount === 1 ? "" : "s"
                    })`}
                  </MenuItem>
                );
              })}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size={"sm"}
                cursor={"pointer"}
                name={user.firstName + user.lastName}
                src={user.displayPicture}
              />
            </MenuButton>
            <MenuList>
              <Profile
                onClick={() => {
                  setOverlay(<Overlay />);
                  onOpen();
                }}
                overlay={overlay}
                user={user}
              >
                <MenuItem>Credentials</MenuItem>
              </Profile>
              <MenuDivider />
              <MenuItem
                onClick={() => {
                  Logout(history);
                }}
              >
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={drawerRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Search for your friends</DrawerHeader>

          <DrawerBody>
            <Box
              display={"flex"}
              flexDirection="row"
              justifyContent={"space-between"}
              gap="0.3rem"
            >
              <Input
                placeholder="Search"
                onChange={setSearchAndsearchUsers}
                value={search}
              />
              <Button
                colorScheme="purple"
                isLoading={loading}
                onClick={searchUsers}
              >
                Go
              </Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult &&
              searchResult.length >= 1 && (
                <ShowUsers
                  users={searchResult}
                  setLoadingChat={setLoadingChat}
                  onClose={onClose}
                />
              )
            )}
            {loadingChat && (
              <Center bg="transparent" h="15vh" color="white">
                <Spinner
                  thickness="4px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color="blue.500"
                  size="xl"
                  boxSize={20}
                />
              </Center>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
