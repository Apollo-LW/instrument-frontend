// Chakra imports
import { Box, Button, Checkbox, Flex, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, Text, useCheckbox, useCheckboxGroup, useColorModeValue, useDisclosure } from "@chakra-ui/react";
import {
  chakra
} from "@chakra-ui/system"
// Assets
import Project1 from "assets/img/profile/Project1.png";
import Project2 from "assets/img/profile/Project2.png";
import Project3 from "assets/img/profile/Project3.png";
import axios from "axios";
// Custom components
import Card from "components/card/Card.js";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import ValidationUtil from "utils";
import Project from "views/admin/profile/components/Project";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Projects(props) {
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "gray.400";
  const cardShadow = useColorModeValue(
    "0px 18px 40px rgba(112, 144, 176, 0.12)",
    "unset"
  );
  const pics = [Project1, Project2, Project3];
  const { isOpen, onOpen, onClose } = useDisclosure()

  const initialRef = React.useRef();
  const finalRef = React.useRef();
  const history = useHistory();

  const INSRUMENT_SERVICE = "http://localhost:3000";
  const [courses, setCourses] = useState([]);
  const [courseName, setCourseName] = useState("");
  const [courseDuration, setCourseDuration] = useState(0);
  const [courseDescription, setCourseDescription] = useState("");
  const [courseStartTimeDate, setCourseStartTimeDate] = useState("");
  const [courseEndTimeDate, setCourseEndTimeDate] = useState("");
  const [courseStartDate, setCourseStartDate] = useState("");
  const [courseEndDate, setCourseEndDate] = useState("");
  const [courseIsPublic, setCourseIsPublic] = useState(false);
  const [error, setError] = useState("");
  const { value, getCheckboxProps } = useCheckboxGroup({defaultValue: [],});

  const CustomCheckbox = (props) => {
    const { state, getCheckboxProps, getInputProps, getLabelProps, htmlProps } = useCheckbox(props)

    return (
      <chakra.label
        display='flex'
        flexDirection='row'
        alignItems='center'
        gridColumnGap={2}
        maxW='20'
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
        <Text color='gray.700' {...getLabelProps()}>{props.value}</Text>
      </chakra.label>
    )
  };

  const fetchUserCourses = async () => {
    const response = await axios.get(`${INSRUMENT_SERVICE}/course/user/list/${localStorage.getItem("userId")}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      }
    });
    
    if (response.status == 401) {
      history.push("/auth");
      return;
    }
    
    if (response.data) {
      setCourses(response.data);
    }
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

  const createCourse = async (e) => {
    if (courseName === '' || courseName === ' ') {
      setError("A valid name is required");
      return;
    }

    try {
      const resposne = await axios.post(`${INSRUMENT_SERVICE}/course`, {
        "name": courseName,
        "courseDescription": courseDescription,
        "startDate": courseStartDate,
        "endDate": courseEndDate,
        "startTime": courseStartTimeDate,
        "endTime": courseEndTimeDate,
        "isPublic": courseIsPublic,
        "repeatedDays": value,
        "duration": courseDuration,
        "creatorID": localStorage.getItem("userId")
      }, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        }
      });
      console.log(resposne.data);
      showToastMessage("Course " + courseName + " created Successfully!!");
      onClose();
    } catch (error) {
      // setError(error.response);
      showToastMessage("Failed to create Course " + courseName);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserCourses();
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
        All Courses
      </Text>
      <Text color={textColorSecondary} fontSize='md' me='26px' mb='40px'>
        Dive deeper into your coursework! Here you'll find all the information you need to thrive, in-depth course descriptions.
      </Text>
      {
        courses.map((course, index) =>
          <div key={index}>
            <Project
              key={index + 1}
              ranking={index + 1}
              title={course.name}
              link='#'
              type='course'
              boxShadow={cardShadow}
              mb='20px'
              image={pics[index % 3]}/>
          </div>
        )
      }
      <Button
        me='100%'
        mb='50px'
        w='340px'
        minW='340px'
        mt={{ base: "20px", "2xl": "auto" }}
        variant='brand'
        background="Green"
        onClick={onOpen}
        fontWeight='500'>
        Create Course
      </Button>
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          {error && <div style={{ color: "red" }}>{error}</div>}{" "}
          <ModalHeader>Create your Course</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Course name</FormLabel>
              <Input ref={initialRef} placeholder='Painting course' color={textColorPrimary} onChange={e => setCourseName(e.target.value)} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Course Desciption</FormLabel>
              <Input placeholder='Course Desciption' color={textColorPrimary} onChange={e => setCourseDescription(e.target.value)} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Course Start Date</FormLabel>
              <Input type='date' placeholder='' color={textColorPrimary} onChange={e => setCourseStartDate(e.target.value)} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Course Start Time</FormLabel>
              <Input type='time' placeholder='S, T, T 10:00-11:00 A.M' color={textColorPrimary} onChange={e => setCourseStartTimeDate(e.target.value)} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Course End Date</FormLabel>
              <Input type='date' placeholder='' color={textColorPrimary} onChange={e => setCourseEndDate(e.target.value)} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Course End Time</FormLabel>
              <Input type='time' placeholder='S, T, T 10:00-11:00 A.M' color={textColorPrimary} onChange={e => setCourseEndTimeDate(e.target.value)} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Course Duration in mintues</FormLabel>
              <Input type='number' placeholder='60' color={textColorPrimary} onChange={e => setCourseDuration(e.target.value)} />
            </FormControl>

            <FormControl mt={4}>
            <FormLabel>Repeat every</FormLabel>
              <Stack>
                <CustomCheckbox {...getCheckboxProps({ value: 'Sun' })} />
                <CustomCheckbox {...getCheckboxProps({ value: 'Mon' })} />
                <CustomCheckbox {...getCheckboxProps({ value: 'Tue' })} />
                <CustomCheckbox {...getCheckboxProps({ value: 'Wed' })} />
                <CustomCheckbox {...getCheckboxProps({ value: 'Thu' })} />
                <CustomCheckbox {...getCheckboxProps({ value: 'Fri' })} />
                <CustomCheckbox {...getCheckboxProps({ value: 'Sat' })} />
              </Stack>
            </FormControl>

            <FormControl mt={4}>
              <Checkbox colorScheme="green" isChecked={courseIsPublic} onChange={e => setCourseIsPublic(e.target.checked)}>Check this box if you want your course to be PUBLIC</Checkbox>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose} mr={3} background="red">Discard</Button>
            <Button colorScheme='blue' mr={3} onClick={createCourse}>Create</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Card>
  );
}
