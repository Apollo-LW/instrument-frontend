// Chakra imports
import { Avatar, Box, Flex, Text, useColorModeValue, Button, Grid, Image, SimpleGrid, 
  useDisclosure, FormControl, FormLabel, 
  Input, Modal, ModalBody, ModalCloseButton,
  ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import Card from "components/card/Card.js";
import React, { useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { MdBuild, MdCall } from "react-icons/md";
import axios from "axios";

export default function Banner(props) {
  const { banner, avatar, username, firstName, lastName, email } = props;

  const { isOpen, onOpen, onClose } = useDisclosure()

  const initialRef = React.useRef();
  const finalRef = React.useRef();
  const history = useHistory();
  
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "gray.400";
  const borderColor = useColorModeValue(
    "white !important",
    "#111C44 !important"
  );

  const INSRUMENT_SERVICE = "http://localhost:3000";
  const ONLY_LETTERS = /^[a-zA-Z]+$/;
  const USERNAME_REGEX = /^[a-zA-Z0-9_\.]+$/;
  const EMAIL_REGEX = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
  const [error, setError] = useState("");
  const [updatedFirstName, setUpdatedFirstName] = useState(firstName);
  const [updatedLastName, setUpdatedLastName] = useState(lastName);
  const [updatedUsername, setUpdatedUsername] = useState(username);
  const [updatedEmail, setUpdatedEmail] = useState(email);

  const updateProfile = async () => {
    if (updatedFirstName === '' || updatedFirstName === ' ' || !ONLY_LETTERS.test(updatedFirstName)) {
      setError("A valid (only letters) First Name is required");
      return;
    }

    if (updatedLastName === '' || updatedLastName === ' ' || !ONLY_LETTERS.test(updatedLastName)) {
      setError("A valid (only letters) Last Name is required");
      return;
    }

    if (updatedEmail === '' || updatedEmail === ' ' || !EMAIL_REGEX.test(updatedEmail)) {
      setError("A valid email is required");
      return;
    }
    if (updatedUsername === '' || updatedUsername === ' ' || !USERNAME_REGEX.test(updatedUsername)) {
      setError("Usernames are required and must only contain letters, digits, dots, and underscores");
      return;
    }

    try {
      const response = await axios.patch(`${INSRUMENT_SERVICE}/user/${localStorage.getItem("userId")}`, {
        "firstName": updatedFirstName,
        "lastName": updatedLastName,
        "username": updatedUsername,
        "email": updatedEmail
      }, {
        "Authorization" : `Bearer ${localStorage.getItem("token")}`,
      });
      console.log(response)
      onClose();
    } catch (error) {
      // Catching any expections from the backend
      setUpdatedUsername(username);
      setUpdatedEmail(email);
      setUpdatedFirstName(firstName);
      setUpdatedLastName(lastName);
      if (error.response && error.response.data) {
        setError(error.response.data.message); // Set the error message if present in the error response
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  }

  return (
    <Card mb={{ base: "0px", lg: "20px" }} align='center'>
      <Box
        bg={`url(${banner})`}
        bgSize='cover'
        borderRadius='16px'
        h='131px'
        w='100%'
      />
      <Avatar
        mx='auto'
        src={avatar}
        h='87px'
        w='87px'
        mt='-43px'
        border='4px solid'
        borderColor={borderColor}
      />
      <Text color={textColorPrimary} fontWeight='bold' fontSize='xl' mt='10px'>
        {username}
      </Text>
      <Text color={textColorSecondary} fontSize='sm'>
        {email}
      </Text>
      <Flex w='max-content' mx='auto' mt='26px'>
        <Text color={textColorPrimary} fontSize='2xl' fontWeight='700'>
          {firstName + ' ' + lastName}
        </Text>
      </Flex>
      <Button leftIcon={<MdBuild />} colorScheme='orange' variant='solid' onClick={onOpen}>
        Edit Profile
      </Button>
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          {error && <div style={{ color: "red" }}>{error}</div>}{" "}
          <ModalHeader>Update Profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl mt={4}>
              <FormLabel>Username</FormLabel>
              <Input ref={initialRef} type='text' value={updatedUsername} placeholder='MrMoon' color={textColorPrimary} onChange={e => setUpdatedUsername(e.target.value)} />
            </FormControl>

            <FormControl>
              <FormLabel>First Name</FormLabel>
              <Input placeholder='text' value={updatedFirstName} color={textColorPrimary} onChange={e => setUpdatedFirstName(e.target.value)} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Last Name</FormLabel>
              <Input placeholder='Ibrahim' value={updatedLastName} color={textColorPrimary} onChange={e => setUpdatedLastName(e.target.value)} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Email</FormLabel>
              <Input type='email' value={updatedEmail} placeholder='temp@gmail.com' color={textColorPrimary} onChange={e => setUpdatedEmail(e.target.value)} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose} mr={3} background="red">Discard</Button>
            <Button colorScheme='blue' mr={3} onClick={updateProfile}>Update</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Card>
  );
}
