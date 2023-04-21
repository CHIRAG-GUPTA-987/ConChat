import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [displayPicture, setDisplayPicture] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const history = useHistory();

  //Uploading image to cloudinary
  const postImage = (pic) => {
    setLoading(true);
    if (pic === undefined) {
      toast({
        title: "No image selected",
        description: "Please upload your display picture",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
      return;
    }
    if (pic.type === "image/jpeg" || pic.type === "image/png") {
      const data = new FormData();
      data.append("file", pic);
      data.append("upload_preset", "conchat");
      data.append("cloud_name", "dxgbebpzs");
      try {
        fetch("https://api.cloudinary.com/v1_1/dxgbebpzs/image/upload", {
          method: "post",
          body: data,
        })
          .then((res) => res.json())
          .then((data) => {
            setDisplayPicture(data.url.toString());
            setLoading(false);
            console.log(data);
          });
      } catch (e) {
        console.log(`Error: ${e}`);
        setLoading(false);
      }
    }
  };

  //Submitting the form to backend
  const submitHandler = async () => {
    setLoading(true);
    if (!firstName || !email || !password || !confirmPassword) {
      toast({
        title: "Please provide required fields",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
      return;
    } else if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        status: "error",
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
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKENDURL}/api/user/register`,
        {
          firstName,
          lastName,
          password,
          displayPicture,
          email,
        },
        config
      );
      toast({
        title: "Successfully registered with Conchat",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      history.push("/chats");
    } catch (e) {
      console.log(e);
      toast({
        title: "Try again later",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
    }
  };
  return (
    <VStack spacing={4} align="stretch">
      <FormControl id="firstName" isRequired>
        <FormLabel>First Name</FormLabel>
        <Input
          placeholder="Enter your first name"
          onChange={(e) => setFirstName(e.target.value)}
        />
      </FormControl>
      <FormControl id="lastName">
        <FormLabel>Last Name</FormLabel>
        <Input
          placeholder="Enter your last name"
          onChange={(e) => setLastName(e.target.value)}
        />
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>User Email</FormLabel>
        <Input
          type={"email"}
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Enter a strong password"
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
      <FormControl id="confirmPassword" isRequired>
        <FormLabel>Confirm password</FormLabel>
        <InputGroup>
          <Input
            type={"password"}
            placeholder="Re-enter the above password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </InputGroup>
      </FormControl>
      <FormControl id="displayPicture">
        <FormLabel>Upload your picture</FormLabel>
        <Input
          type="file"
          accept="image/*"
          p={1.5}
          onChange={(e) => postImage(e.target.files[0])}
        />
      </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Create Account
      </Button>
    </VStack>
  );
};

export default Signup;
