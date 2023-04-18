import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Text,
  Button,
  IconButton,
  Image,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";

const Profile = ({ user, children, overlay }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
      )}
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        {overlay}
        <ModalContent fontFamily={"Work sans"}>
          <ModalHeader>{user.firstName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display={"flex"}
            justifyContent="center"
            flexDirection={"column"}
            alignItems={"center"}
          >
            <Image
              borderRadius={"full"}
              src={user.displayPicture}
              alt={user.userName}
              w={"40vw"}
            />
            <Text textAlign={"center"}>{user.email}</Text>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Profile;
