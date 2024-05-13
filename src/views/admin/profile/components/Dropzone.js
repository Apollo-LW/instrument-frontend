// Chakra imports
import { Button, Flex, Input, Text, useColorModeValue } from "@chakra-ui/react";
// Assets
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

function Dropzone(props) {
  const { content, ...rest } = props;
  const [selectedImages, setSelectedImages] = useState([]);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    acceptedFiles.forEach((file) => {
      setSelectedImages((prevState) => [...prevState, file]);
    });
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({ onDrop });
  const bg = useColorModeValue("gray.100", "navy.700");
  const borderColor = useColorModeValue("secondaryGray.100", "whiteAlpha.100");
  return (
    <Flex
      align='center'
      justify='center'
      bg={bg}
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
        <Button variant='no-effects'>{content}</Button> &&
        <div>
        {
          selectedImages.map((image, index) => (
            <img src={`${URL.createObjectURL(image)}`} key={index} alt="" />
          ))}
      </div>
      }
    </Flex>
  );
}

export default Dropzone;
