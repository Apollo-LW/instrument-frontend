// Chakra imports
import {
  Box,
  Button,
  Flex,
  Icon,
  Input,
  Text,
  Checkbox,
  useColorModeValue,
  ModalBody, 
  ModalCloseButton, 
  ModalContent, 
  ModalFooter, 
  ModalHeader, 
  ModalOverlay, 
  Modal,
  useDisclosure,
  useCheckbox, 
  useCheckboxGroup,
} from "@chakra-ui/react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  chakra
} from "@chakra-ui/system"
import axios from "axios";
// Custom components
import Card from "components/card/Card.js";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { MdUpload } from "react-icons/md";

export default function Upload(props) {
  const { used, total, ...rest } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { value, getCheckboxProps } = useCheckboxGroup({defaultValue: [],});
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const brandColor = useColorModeValue("brand.500", "white");
  const textColorSecondary = "gray.400";
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isAssetPublic, setIsAssetPublic] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [assetId, setAssetId] = useState("");
  const [suggestedCouses, setSuggestedCouses] = useState([]);
  const ASSET_MANAGMENT = "http://localhost:3002";
  const INSRUMENT_SERVICE = "http://localhost:3000";

  const CustomCheckbox = (props) => {
    const { state, getCheckboxProps, getInputProps, getLabelProps, htmlProps } = useCheckbox(props)

    return (
      <chakra.label
        display='flex'
        flexDirection='row'
        alignItems='center'
        gridColumnGap={2}
        bg='green.50'
        border='1px solid'
        borderColor='green.500'
        rounded='lg'
        px={3}
        py={1}
        cursor='pointer'
        {...htmlProps}>
        <input {...getInputProps()} hidden />
        <Flex
          alignItems='center'
          justifyContent='center'
          border='2px solid'
          borderColor='green.500'
          w={4}
          h={4}
          {...getCheckboxProps()}>
          {state.isChecked && <Box w={2} h={2} bg='green.500' />}
        </Flex>
        <Text color='gray.700' {...getLabelProps()}>{props.value.split(":")[0]}</Text>
      </chakra.label>
    )
  };

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    acceptedFiles.forEach((file) => {
      setSelectedFiles((prevState) => [...prevState, file]);
    });
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({ onDrop });
  const borderColor = useColorModeValue("secondaryGray.100", "whiteAlpha.100");

  const testDate = async (e) => {
    const userAdd = await axios.get(`${INSRUMENT_SERVICE}/asset/test`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      }
    });
    console.log(userAdd);
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

  const uploadFile = async (e) => {
    if (selectedFiles.length == 0) {
      setUploadStatus("Upload Failed!, please select at least one file");
      return;
    }
    setUploadStatus("Uploading...");
    selectedFiles.map(async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      const response = axios.post(`${ASSET_MANAGMENT}/api/files`,
        formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      }).then(fileResponse => {
        const data = fileResponse.data[0];
        const assetAdd = axios.post(`${INSRUMENT_SERVICE}/asset`, {
          name: file.name,
          creatorId: localStorage.getItem("userId"),
          assetId: data.id,
          isPublic: isAssetPublic,
          size: file.size,
          createdAt: data.uploadDate,
          fileLastModified: file.lastModifiedDate,
        }, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          }
        }).then(assetAddResposne => {
          //setUploadStatus(`Successfully Uploaded ${selectedFiles.length} assets :)`);            
          showToastMessage(`Successfully Uploaded ${selectedFiles.length} assets :)`, true);
          setSelectedFiles([]);
          setIsAssetPublic(false);
          const suggestedCousesTmp = assetAddResposne.data.courseSuggestion.courses;
          if (suggestedCousesTmp.length > 0) {
            setSuggestedCouses(suggestedCousesTmp);
            setAssetId(assetAddResposne.data.courseSuggestion.assetId);
            onOpen();
          }
        }).then((tmp) => console.log(tmp));
      }).catch((err) => {
        //setUploadStatus("Upload Failed!");
        showToastMessage(`Upload Failed!`, false);
      })
    });
  };

  const addAsset = async () => {
    Promise.all(value.map(async (courseToAdd) => {
      try {
        const response = await axios.post(`${INSRUMENT_SERVICE}/course/asset`, {
          "courseId": courseToAdd.split(":")[1],
          "userId": localStorage.getItem('userId'),
          "assetId": assetId
        }, {
          headers: {
            "Authorization" : `Bearer ${localStorage.getItem("token")}`,
          }
        });
  
        if (response.data) {
          showToastMessage("Asset Added Successfully!!", true);
        }
      } catch (err) {
        console.log(err);
        showToastMessage("Asset Failed to Add", false);
      };
    })).then((response) => console.log(response));
  };

  return (
    <Card {...rest} mb='20px' align='center' p='25px'>
      <ToastContainer />
      <Flex h='100%' direction={{ base: "column", "2xl": "row" }}>
        <Flex
          align='center'
          justify='center'
          bg={useColorModeValue("gray.100", "navy.700")}
          border='1px dashed'
          borderColor={borderColor}
          borderRadius='16px'
          w='100%'
          h='max-content'
          minH='100%'
          cursor='pointer'
          {...getRootProps({ className: "dropzone" })}
          {...rest}>
          <Input variant='main' {...getInputProps()} />
          {
            selectedFiles.length == 0 ?
            <Button variant='no-effects'>{
              <Box>
                <Icon as={MdUpload} w='80px' h='80px' color={brandColor} />
                <Flex justify='center' mx='auto' mb='12px'>
                  <Text fontSize='xl' fontWeight='700' color={brandColor}>
                    Upload Files
                  </Text>
                </Flex>
                <Text fontSize='sm' fontWeight='500' color='secondaryGray.500'>
                  PDF, PPTX, PNG, JPG and more files are allowed!!
                </Text>
              </Box>  
            }</Button> :
            <div>
            {
              selectedFiles.map((file, index) => (
                <img src={`${URL.createObjectURL(file)}`} key={index} alt="" />
              ))}
          </div>
          }
        </Flex>
        <Flex direction='column' p='20px' pe='64px'>
          <Text
            fontWeight='bold'
            textAlign='start'
            fontSize='2xl'
            color={uploadStatus.includes("Upload Failed!") ? "red" : "green"}
            mt={{ base: "20px", "2xl": "50px" }}>
            {uploadStatus}
          </Text>
          <Checkbox colorScheme="green" isChecked={isAssetPublic} onChange={e => setIsAssetPublic(e.target.checked)}>Do you wanna make this public</Checkbox>
          <Flex w='100%'>
            <Button
              me='100%'
              mb='50px'
              w='140px'
              minW='140px'
              mt={{ base: "20px", "2xl": "auto" }}
              onClick={uploadFile}
              variant='brand'
              fontWeight='500'>
              Upload Assets
            </Button>
          </Flex>
        </Flex>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Suggested Courses to add the asset to</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {suggestedCouses && suggestedCouses.map((course) => (
                <div key={course._id}>
                  <CustomCheckbox width="100%" key={course._id} {...getCheckboxProps({ value: course.name + ":" + course._id})} />
                </div>
              ))}
            </ModalBody>
            <ModalFooter>
            <Button onClick={onClose} mr={3} background="red">Discard</Button>
            <Button colorScheme='blue' mr={3} onClick={addAsset}>Add</Button>
          </ModalFooter>
          </ModalContent>
        </Modal>
      </Flex>
    </Card>
  );
}
