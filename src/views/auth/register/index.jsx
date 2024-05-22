import React , { useContext, useEffect, useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
// Chakra imports
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
// Custom components
import { HSeparator } from "components/separator/Separator";
import DefaultAuth from "layouts/auth/Default";
// Assets
import illustration from "assets/img/auth/auth.png";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";
import axios from "axios";
import { AuthContext } from "contexts/AuthContext";

function Register() {
  const history = useHistory();
  useEffect(() => {
    if (localStorage.getItem("token") != null) {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
    }
  }, []);

  const INSRUMENT_SERVICE = "http://localhost:3000";
  const ONLY_LETTERS = /^[a-zA-Z]+$/;
  const USERNAME_REGEX = /^[a-zA-Z0-9_\.]+$/;
  const EMAIL_REGEX = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
  const PASSWORD_REGEX = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const { setToken } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // validating input
    if (firstName === '' || firstName === ' ' || !ONLY_LETTERS.test(firstName)) {
      setError("A valid (only letters) First Name is required");
      return;
    }
    if (lastName === '' || lastName === ' ' || !ONLY_LETTERS.test(lastName)) {
      setError("A valid (only letters) Last Name is required");
      return;
    }
    if (email === '' || email === ' ' || !EMAIL_REGEX.test(email)) {
      setError("A valid email is required");
      return;
    }
    if (username === '' || username === ' ' || !USERNAME_REGEX.test(username)) {
      setError("Usernames are required and must only contain letters, digits, dots, and underscores");
      return;
    }
    if (password === '' || password === ' ' || !PASSWORD_REGEX.test(password)) {
      setError("A password is required and must contain at least one special character and at least one number");
      return;
    }

    try {
      // Requesting the instrument-service auth registration endpoint.
      const register = await axios.post(`${INSRUMENT_SERVICE}/auth/register`, {
        "username": username,
        "password": password,
        "firstName": firstName,
        "lastName": lastName,
        "email": email,
      });
      // You have to login to get the token.
      const login = await axios.post(`${INSRUMENT_SERVICE}/auth/login`, {
        "username": username,
        "password": password,
      });
      // Getting the token.
      setToken(login.data.accessToken);
      localStorage.setItem("token", login.data.accessToken);
      localStorage.setItem("userId", login.data.userId);
      // Redirect to the main page.
      history.push('/admin');
    } catch (error) {
      // Catching any expections from the backend
      setToken(null);
      localStorage.removeItem("token");
      if (error.response && error.response.data) {
        setError(error.response.data.message); // Set the error message if present in the error response
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  }

  // Chakra color mode
  const textColor = useColorModeValue("navy.700", "white");
  const textColorSecondary = "gray.400";
  const textColorDetails = useColorModeValue("navy.700", "secondaryGray.600");
  const textColorBrand = useColorModeValue("brand.500", "white");
  const brandStars = useColorModeValue("brand.500", "brand.400");
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  return (
    <DefaultAuth illustrationBackground={illustration} image={illustration}>
      <Flex
        maxW={{ base: "100%", md: "max-content" }}
        w='100%'
        mx={{ base: "auto", lg: "0px" }}
        me='auto'
        h='100%'
        alignItems='start'
        justifyContent='center'
        mb={{ base: "30px", md: "60px" }}
        px={{ base: "25px", md: "0px" }}
        mt={{ base: "40px", md: "14vh" }}
        flexDirection='column'>
        <Box me='auto'>
          <Heading color={textColor} fontSize='36px' mb='10px'>
            Register
          </Heading>
          <Text
            mb='36px'
            ms='4px'
            color={textColorSecondary}
            fontWeight='400'
            fontSize='md'>
            Enter your info Register!
          </Text>
        </Box>
        <Flex
          zIndex='2'
          direction='column'
          w={{ base: "100%", md: "420px" }}
          maxW='100%'
          background='transparent'
          borderRadius='15px'x
          mx={{ base: "auto", lg: "unset" }}
          me='auto'
          mb={{ base: "20px", md: "auto" }}>
          <FormControl>
          {error && <div style={{ color: "red" }}>{error}</div>}{" "}
          <FormLabel
              display='flex'
              ms='4px'
              id="firstName"
              fontSize='sm'
              fontWeight='500'
              color={textColor}
              mb='8px'>
              First Name<Text color={brandStars}>*</Text>
            </FormLabel>
            <Input
              isRequired={true}
              variant='auth'
              fontSize='sm'
              id="firstNameInput"
              ms={{ base: "0px", md: "0px" }}
              type='text'
              placeholder='Mohammad'
              onChange={(un) => setFirstName(un.target.value)}
              mb='24px'
              fontWeight='500'
              size='lg'
            />
          <FormLabel
              display='flex'
              ms='4px'
              id="lastName"
              fontSize='sm'
              fontWeight='500'
              color={textColor}
              mb='8px'>
              Last Name<Text color={brandStars}>*</Text>
            </FormLabel>
            <Input
              isRequired={true}
              variant='auth'
              fontSize='sm'
              id="lastNameInput"
              ms={{ base: "0px", md: "0px" }}
              type='text'
              placeholder='Abu-Amara'
              onChange={(un) => setLastName(un.target.value)}
              mb='24px'
              fontWeight='500'
              size='lg'
            />
            <FormLabel
              display='flex'
              ms='4px'
              id="lastName"
              fontSize='sm'
              fontWeight='500'
              color={textColor}
              mb='8px'>
              Email<Text color={brandStars}>*</Text>
            </FormLabel>
            <Input
              isRequired={true}
              variant='auth'
              fontSize='sm'
              id="emailInput"
              ms={{ base: "0px", md: "0px" }}
              type='text'
              placeholder='Abu-Amara'
              onChange={(un) => setEmail(un.target.value)}
              mb='24px'
              fontWeight='500'
              size='lg'
            />
            <FormLabel
              display='flex'
              ms='4px'
              id="username"
              fontSize='sm'
              fontWeight='500'
              color={textColor}
              mb='8px'>
              Username<Text color={brandStars}>*</Text>
            </FormLabel>
            <Input
              isRequired={true}
              variant='auth'
              fontSize='sm'
              id="usernameInput"
              ms={{ base: "0px", md: "0px" }}
              type='text'
              placeholder='MrMoon'
              onChange={(un) => setUsername(un.target.value)}
              mb='24px'
              fontWeight='500'
              size='lg'
            />
            <FormLabel
              ms='4px'
              fontSize='sm'
              fontWeight='500'
              color={textColor}
              id="password"
              display='flex'>
              Password<Text color={brandStars}>*</Text>
            </FormLabel>
            <InputGroup size='md'>
              <Input
                isRequired={true}
                fontSize='sm'
                placeholder='Min. 8 characters'
                mb='24px'
                size='lg'
                onChange={(pass) => setPassword(pass.target.value)}
                type={show ? "text" : "password"}
                variant='auth'
              />
              <InputRightElement display='flex' alignItems='center' mt='4px'>
                <Icon
                  color={textColorSecondary}
                  _hover={{ cursor: "pointer" }}
                  as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                  onClick={handleClick}
                />
              </InputRightElement>
            </InputGroup>
            <Button
              fontSize='sm'
              variant='brand'
              fontWeight='500'
              w='100%'
              h='50'
              onClick={handleSubmit}
              mb='24px'>
              Register
            </Button>
          </FormControl>
        </Flex>
      </Flex>
    </DefaultAuth>
  );
}

export default Register;
