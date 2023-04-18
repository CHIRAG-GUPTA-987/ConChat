import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import Login from "../Components/Auth/Login";
import Signup from "../Components/Auth/Signup";

const Homepage = () => {
  const history = useHistory();
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      history.push("/chats");
    }
  }, [history]);
  return (
    <Container
      display="flex"
      height="90vh"
      alignItems="flex-start"
      width="90vw"
      margin="5vh 5vw"
    >
      <Box
        width="100%"
        bg="white"
        borderRadius="0.5rem"
        boxShadow="0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);"
        padding="1.5rem 2rem"
      >
        <Box>
          <Text
            paddingBottom="1rem"
            width="100%"
            fontSize="2rem"
            fontFamily="Work Sans"
            fontWeight="bold"
            cursor={"default"}
          >
            Welcome to Conchat...
          </Text>
          <Text>
            <Tabs isFitted variant="enclosed" fontFamily="Work Sans">
              <TabList mb="1em">
                <Tab fontWeight="600">Login</Tab>
                <Tab fontWeight="600">SignUp</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Login />
                </TabPanel>
                <TabPanel>
                  <Signup />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Text>
        </Box>
      </Box>
    </Container>
  );
};

export default Homepage;
