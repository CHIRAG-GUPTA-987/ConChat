import { Box, SkeletonCircle, SkeletonText } from "@chakra-ui/react";
import React from "react";

const ChatLoadSkeleton = () => {
  return (
    <Box
      padding="6"
      boxShadow="lg"
      bg="white"
      display={"flex"}
      justifyContent="space-between"
      alignItems={"center"}
    >
      <SkeletonCircle size="10" />
      <div style={{ width: "80%" }}>
        <SkeletonText
          mt="4"
          noOfLines={2}
          spacing="4"
          skeletonHeight="2"
          margin={"0"}
        />
      </div>
    </Box>
  );
};

export default ChatLoadSkeleton;
