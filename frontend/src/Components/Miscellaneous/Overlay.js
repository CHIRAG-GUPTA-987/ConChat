import { ModalOverlay } from "@chakra-ui/react";
import React from "react";

const Overlay = () => {
  return (
    <ModalOverlay
      bg="blackAlpha"
      backdropFilter="blur(5px) hue-rotate(270deg)"
    />
  );
};

const Overlay2 = () => {
  return (
    <ModalOverlay
      bg={"blackAlpha.500"}
      backdropFilter="auto"
      backdropInvert="40%"
      backdropBlur="5px"
    />
  );
};
export default Overlay;
export { Overlay2 };
