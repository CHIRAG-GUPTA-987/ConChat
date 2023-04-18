import React from "react";
import { Box } from "@chakra-ui/react";
import "./Contextmenu.css";
import DeleteGroupChat from "../Chat/GroupChats/DeleteGroupChat";
import { Overlay2 } from "./Overlay";
import { ChatState } from "../../Context/ChatProvider";
import UpdateGroupChat from "../Chat/GroupChats/UpdateGroupChat";

const Contextmenu = ({ x, y, closeContext, chat }) => {
  const [overlay, setOverlay] = React.useState(<Overlay2 />);
  const { user } = ChatState();
  return (
    <Box
      style={{
        top: `${y}px`,
        left: `${x}px`,
        position: "absolute",
        boxShadow: "0 0 0.5rem 0.2rem rgba(0, 0, 0, 0.2)",
        borderRadius: "0.3rem",
        padding: "0.5rem 0",
        backgroundColor: "rgb(255, 255, 255, 0.7)",
        maxWidth: "200px",
        width: "50vw",
        zIndex: "100",
      }}
    >
      <ul id="contextMenuUl">
        <UpdateGroupChat
          overlay={overlay}
          user={user}
          closeContext={closeContext}
          chat={chat}
        >
          <li className="contextMenuLi">Update</li>
        </UpdateGroupChat>
        <DeleteGroupChat
          overlay={overlay}
          user={user}
          closeContext={closeContext}
          chat={chat}
        >
          <li className="contextMenuLi">Delete</li>
        </DeleteGroupChat>
      </ul>
    </Box>
  );
};

export default Contextmenu;
