import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { v4 as uuidv4 } from "uuid";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

const Login = () => {
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingGuest, setLoadingGuest] = useState(false);
  const [guestId, setguestId] = useState(null);

  const toast = useToast();
  const history = useHistory();

  const submitHandler = async () => {
    setLoading(true);
    if (!username || !password) {
      toast({
        title: "Please provide user credentials",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
      return;
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      let data = {};
      if (username === `guest${guestId}`) {
        data = await axios.post(
          `${process.env.REACT_APP_BACKENDURL}/api/user/register`,
          {
            firstName: "Guest",
            email: `${guestId}@guest.conchat`,
            displayPicture: "",
            password,
          },
          config
        );
      } else {
        data = await axios.post(
          `${process.env.REACT_APP_BACKENDURL}/api/user/login`,
          {
            username,
            password,
          },
          config
        );
      }
      toast({
        title: "Successfully logged in Conchat",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      console.log(localStorage.getItem("userInfo"));
      setLoading(false);
      history.push("/chats");
    } catch (e) {
      toast({
        title: "Try again later",
        description: "Username or password maybe incorrect",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
    }
  };
  const guestHandler = () => {
    setLoadingGuest(true);
    const uuidGenerated = uuidv4();
    setUsername(`guest${uuidGenerated}`);
    setPassword(uuidGenerated);
    setguestId(uuidGenerated);
    setTimeout(() => {
      setLoadingGuest(false);
      toast({
        title: "Guest credentials generated successfully",
        status: "info",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
    }, 50);
  };
  return (
    <VStack spacing={4} align="stretch">
      <FormControl id="email" isRequired>
        <FormLabel>Username</FormLabel>
        <Input
          type={"text"}
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Enter a strong password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button
              h="1.5rem"
              size="sm"
              onClick={(e) => {
                setShowPassword(!showPassword);
              }}
            >
              {showPassword ? (
                <ViewOffIcon boxSize={5} />
              ) : (
                <ViewIcon boxSize={4} />
              )}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        colorScheme="purple"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Proceed
      </Button>
      <Button
        variant="outline"
        colorScheme="red"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={guestHandler}
        isLoading={loadingGuest}
      >
        Get guest user credentials
      </Button>
    </VStack>
  );
};

export default Login;
