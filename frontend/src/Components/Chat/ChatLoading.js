import React from "react";
import { Stack } from "@chakra-ui/react";
import ChatLoadSkeleton from "./ChatLoadSkeleton";

const ChatLoading = () => {
  return (
    <>
      <Stack>
        <ChatLoadSkeleton />
        <ChatLoadSkeleton />
        <ChatLoadSkeleton />
        <ChatLoadSkeleton />
        <ChatLoadSkeleton />
        <ChatLoadSkeleton />
        <ChatLoadSkeleton />
        <ChatLoadSkeleton />
        <ChatLoadSkeleton />
      </Stack>
    </>
  );
};

export default ChatLoading;
