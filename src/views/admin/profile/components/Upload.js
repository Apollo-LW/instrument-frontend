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
} from "@chakra-ui/react";
import axios from "axios";
// Custom components
import Card from "components/card/Card.js";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { MdUpload } from "react-icons/md";

export default function Upload(props) {
  const { used, total, ...rest } = props;
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const brandColor = useColorModeValue("brand.500", "white");
  const textColorSecondary = "gray.400";
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isAssetPublic, setIsAssetPublic] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const ASSET_MANAGMENT = "http://localhost:3002";
  const INSRUMENT_SERVICE = "http://localhost:3000";

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

  const uploadFile = async (e) => {
    if (selectedFiles.length == 0) {
      setUploadStatus("Upload Failed!, please select at least one file");
      return;
    }
    setUploadStatus("Uploading...");
    try {
      Promise.all(selectedFiles.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        const response = await axios.post(`${ASSET_MANAGMENT}/api/files`,
          formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          }
        });
        const userAdd = await axios.post(`${INSRUMENT_SERVICE}/asset`, {
          name: response.filename,
          creatorId: localStorage.getItem("userId"),
          assetId: response.id,
          isPublic: isAssetPublic,
          size: response.size,
          fileLastModified: file.lastModifiedDate,
        }, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          }
        });
        console.log(userAdd.data);
      }));
      setUploadStatus(`Successfully Uploaded ${selectedFiles.length} assets :)`);
      setSelectedFiles([]);
      setIsAssetPublic(false);
    } catch (e) {
      console.log(e);
      setUploadStatus("Upload Failed!");
    }
  }

  return (
    <Card {...rest} mb='20px' align='center' p='25px'>
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
      </Flex>
    </Card>
  );
}
