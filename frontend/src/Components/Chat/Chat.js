import { Avatar, Box, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Contextmenu from "../Miscellaneous/Contextmenu";

const initialContext = { show: false, x: 0, y: 0 };

const Chat = ({ loggedUser, chat, changeSelectedChat }) => {
  const [user, setUser] = useState({});
  const [contextmenu, setContextmenu] = useState(initialContext);

  const closeContext = () => {
    setContextmenu(initialContext);
  };

  function getSender(loggedUser, users) {
    users[0]._id === loggedUser.data.id ? setUser(users[1]) : setUser(users[0]);
  }

  useEffect(() => {
    getSender(loggedUser, chat.users);
    // eslint-disable-next-line
  }, []);

  const contextMenuForGroup = (e) => {
    e.preventDefault();
    const { pageX, pageY } = e;
    setContextmenu({ show: true, x: pageX, y: pageY });
  };

  return (
    <>
      {chat.isGroupChat && contextmenu.show && (
        <Contextmenu
          x={contextmenu.x}
          y={contextmenu.y}
          closeContext={closeContext}
          setContextmenu={setContextmenu}
          chat={chat}
        />
      )}
      {chat.isGroupChat && (
        <Box
          onClick={changeSelectedChat}
          cursor="pointer"
          bg={"#E8E8E8"}
          _hover={{ background: "#38B2AC", color: "#FFF" }}
          w="100%"
          display="flex"
          alignItems={"center"}
          color="#000"
          px={"3"}
          py="2"
          mt={2}
          borderRadius="lg"
          onContextMenuCapture={contextMenuForGroup}
        >
          <Avatar
            mr={2}
            size={"md"}
            cursor={"pointer"}
            name={user.username}
            src={
              "https://res.cloudinary.com/dxgbebpzs/image/upload/v1681378345/Conchat/gv3w82f2wtvsn2pkuni3.png"
            }
          />

          <Box>
            <Text>
              <b>{chat.isGroupChat ? chat.chatName : user.firstName}</b>
            </Text>
            {!chat.isGroupChat && (
              <Text
                fontSize={"xs"}
                fontFamily="Work Sans"
                fontWeight={"semibold"}
              >
                {user.username}
              </Text>
            )}
          </Box>
        </Box>
      )}

      {!chat.isGroupChat && (
        <Box
          onClick={changeSelectedChat}
          cursor="pointer"
          bg={"#E8E8E8"}
          _hover={{ background: "#38B2AC", color: "#FFF" }}
          w="100%"
          display="flex"
          alignItems={"center"}
          color="#000"
          px={"3"}
          py="2"
          mt={2}
          borderRadius="lg"
        >
          <Avatar
            mr={2}
            size={"md"}
            cursor={"pointer"}
            name={user.username}
            src={user.displayPicture === "..." ? "" : user.displayPicture}
          />

          <Box>
            <Text>
              <b>{chat.isGroupChat ? chat.chatName : user.firstName}</b>
            </Text>
            {!chat.isGroupChat && (
              <Text
                fontSize={"xs"}
                fontFamily="Work Sans"
                fontWeight={"semibold"}
              >
                {user.username}
              </Text>
            )}
          </Box>
        </Box>
      )}
    </>
  );
};

export default Chat;
