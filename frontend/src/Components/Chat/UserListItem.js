import { Avatar, Box, Text } from "@chakra-ui/react";
import React from "react";
import { ChatState } from "../../Context/ChatProvider";

const UserListItem = ({ user, accessChatHandler }) => {
  return (
    <Box
      onClick={accessChatHandler}
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
        name={user.userName}
        src={user.displayPicture === "..." ? "" : user.displayPicture}
      />
      <Box>
        <Text>
          <b>{user.username}</b>
        </Text>
        <Text fontSize={"sm"} fontFamily="Work Sans" fontWeight={"semibold"}>
          {user.firstName}
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem;
