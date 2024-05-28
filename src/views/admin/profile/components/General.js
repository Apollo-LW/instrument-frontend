// Chakra imports
import { SimpleGrid, Text, useColorModeValue, Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button, 
  Divider,
  useDisclosure,
  ModalCloseButton} from "@chakra-ui/react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
// Custom components
import Card from "components/card/Card.js";
import Project from "views/admin/profile/components/Project";

import React, { useEffect, useState } from "react";

// Assets
export default function GeneralInformation(props) {

  const { ...rest } = props;
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "gray.400";
  const cardShadow = useColorModeValue(
    "0px 18px 40px rgba(112, 144, 176, 0.12)",
    "unset"
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = React.useRef();
  const finalRef = React.useRef();


  const INSRUMENT_SERVICE = "http://localhost:3000";
  const ASSET_MANAGMENT = "http://localhost:3002";
  const [files, setFiles] = useState([]);

  const fetchFiles = async () => {
    const response = await axios.get(`${INSRUMENT_SERVICE}/asset/list/${localStorage.getItem("userId")}`, {
      headers: {
        "Authorization" : `Bearer ${localStorage.getItem("token")}`,
      }
    });

    if (response.data) {
      setFiles(response.data);
    }
  };

  const downloadAsset = async (id, name) => {
    const response = await axios.get(`${ASSET_MANAGMENT}/api/files/download/${id}`, {
      "responseType": "blob"
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.download = name || "downloaded-file";
    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const showToastMessage = (msg, flg) => {
    if (flg) {
      toast.success(msg, {
        position: toast.POSITION.TOP_RIGHT,
      });
    } else {
      toast.error(msg, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const deleteAsset = async (id) => {
    console.log(id);
    const response = await axios.delete(`${ASSET_MANAGMENT}/api/files/${id}`).then(async (responseRes) => {
      console.log(responseRes.data);
      const userRemove = await axios.delete(`${INSRUMENT_SERVICE}/share/${id}/${localStorage.getItem('userid')}`);
      if (userRemove.data) {
        onClose();
        showToastMessage("Successfully Deleted the asset", true);
      }
    }).catch(err => showToastMessage("Failed to Delete the asset", false));
  }

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <Card mb={{ base: "0px", "2xl": "20px" }}>
      <ToastContainer />
      <Text
        color={textColorPrimary}
        fontWeight='bold'
        fontSize='2xl'
        mt='10px'
        mb='4px'>
        All Assets
      </Text>
      <Text color={textColorSecondary} fontSize='md' me='26px' mb='40px'>
        "The future belongs to the curious. The ones who are not afraid to try it, explore it, poke at it, question it and turn it inside out"
      </Text>
      {
        files.map((file, index) =>
          <span key={index}>
            <Project
              key={index + 1}
              ranking={index + 1}
              title={file.name}
              type="asset"
              boxShadow={cardShadow}
              onClick={() => downloadAsset(file.assetId, file.name)}
              mb='20px'/>
              <Button key={index + 1} m='5px' display='inline' onClick={() => deleteAsset(file.assetId)} color='red'>Delete</Button>
              <Divider m='20px' />
          </span>
        )
      }
    </Card>
  );
}
