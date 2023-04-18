import {
  Avatar,
  Box,
  FormControl,
  Tag,
  TagCloseButton,
  TagLabel,
  VStack,
  useToast,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";
import { ChatState } from "../../../Context/ChatProvider";

const GroupUsersEditor = ({
  groupMembers,
  addUserHandler,
  removeUserHandler,
  setUpdatingUsers,
}) => {
  const [groupMembersOptions, setGroupMembersOptions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingGroup, setLoadingGroup] = useState(false);
  const { user } = ChatState();
  const changeSearchQuery = async (e) => {
    setSearchQuery(e.target.value);
  };

  const toast = useToast();

  const searchUsers = async (sq) => {
    setLoadingGroup(true);
    if (sq) {
      try {
        const config = {
          headers: {
            authorization: `Bearer ${user.authToken}`,
          },
        };
        const url = `https://eatable-toothpaste-production.up.railway.app/api/user?search=${sq}`;
        const { data } = await axios.get(url, config);
        let options = [];
        for (let d of data) {
          options.push({
            value: d._id,
            label: `${d.username} | ${d.firstName}`,
          });
        }
        options = options.filter(
          (option) => !groupMembers.find((gM) => gM._id === option.value)
        );
        setGroupMembersOptions(options);
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
      setGroupMembersOptions([]);
    }
    setLoadingGroup(false);
  };

  useEffect(() => {
    searchUsers(searchQuery);
    // eslint-disable-next-line
  }, [searchQuery]);

  return (
    <>
      <VStack>
        <Box m={"2"}>
          {groupMembers &&
            groupMembers.length > 1 &&
            groupMembers.map((gM) => {
              return (
                <Tag
                  size={"lg"}
                  key={gM._id}
                  borderRadius="2xl"
                  variant="solid"
                  colorScheme="teal"
                  m={"1"}
                  cursor={"default"}
                >
                  <Avatar
                    src={gM.displayPicture}
                    size="xs"
                    name="Segun Adebayo"
                    ml={-1}
                    mr={2}
                  />
                  <TagLabel>{gM.username}</TagLabel>
                  <TagCloseButton
                    onClick={async () => {
                      setUpdatingUsers(true);
                      await removeUserHandler(gM);
                      setUpdatingUsers(false);
                    }}
                  />
                </Tag>
              );
            })}
        </Box>
        <FormControl w={"100%"} mt={"3"} onKeyUp={changeSearchQuery}>
          <Select
            options={groupMembersOptions}
            className="basic-multi-select"
            classNamePrefix="select"
            isLoading={loadingGroup}
            onChange={async (e) => {
              setUpdatingUsers(true);
              await addUserHandler(e);
              setGroupMembersOptions([]);
              setSearchQuery("");
              setUpdatingUsers(false);
            }}
            defaultValue={searchQuery}
            placeholder={"Add new user"}
          />
        </FormControl>
      </VStack>
    </>
  );
};

export default GroupUsersEditor;
