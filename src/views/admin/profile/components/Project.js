// Chakra imports
import {
  Box,
  Flex,
  Icon,
  Image,
  Link,
  Text,
  useDisclosure,
  ModalBody, 
  ModalCloseButton, 
  ModalContent, 
  ModalFooter, 
  ModalHeader, 
  ModalOverlay, 
  Modal,
  Button, 
  FormControl, 
  FormLabel, 
  Input,
  useColorModeValue,
  useCheckbox, 
  Checkbox, 
  Stack,
  useCheckboxGroup
} from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";
import {
  chakra
} from "@chakra-ui/system"
import React, { useState } from "react";
import axios from "axios";
// Assets
import { MdEdit } from "react-icons/md";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Project(props) {
  const { title, courseId, ranking, link, image, type, ...rest } = props;
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "gray.400";
  const brandColor = useColorModeValue("brand.500", "white");
  const bg = useColorModeValue("white", "navy.700");
  const INSRUMENT_SERVICE = "http://localhost:3000";
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = React.useRef();
  const finalRef = React.useRef();

  const [selectedCourseId, setSelectedCourseId] = useState(0);
  const [selectedCourseName, setSelectedCourseName] = useState("");
  const [selectedCourseDescription, setSelectedCourseDescription] = useState("");
  const [selectedCourseDuration, setSelectedCourseDuration] = useState("");
  const [selectedCourseStartTime, setSelectedCourseStartTime] = useState("");
  const [selectedCourseEndTime, setSelectedCourseEndTime] = useState("");
  const [selectedCourseStartDate, setSelectedCourseStartDate] = useState("");
  const [selectedCourseEndDate, setSelectedCourseEndDate] = useState("") 
  const [selectedCourseIsPublic, setSelectedCourseIsPublic] = useState(false);
  const { value, getCheckboxProps } = useCheckboxGroup({defaultValue: [],});

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


  const updateCourse = async () => {
    if (selectedCourseName === '' || selectedCourseName === ' ') {
      showToastMessage("course name can't be empty ");
      return;
    }

    try {
      const resposne = await axios.post(`${INSRUMENT_SERVICE}/course`, {
        "name": selectedCourseName,
        "courseDescription": selectedCourseDescription,
        "startDate": selectedCourseStartDate,
        "endDate": selectedCourseEndDate,
        "startTime": selectedCourseStartTime,
        "endTime": selectedCourseEndTime,
        "isPublic": selectedCourseIsPublic,
        "repeatedDays": value,
        "duration": selectedCourseDuration,
      }, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        }
      });
      console.log(resposne.data);
      showToastMessage("Course " + selectedCourseName + " created Successfully!!");
      onClose();
    } catch (error) {
      // setError(error.response);
      showToastMessage("Failed to create Course " + selectedCourseName);
      console.log(error);
    }
  };

  const showCourseDetails = async () => {
    const resposne = await axios.get(`${INSRUMENT_SERVICE}/course/${courseId}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      }
    });
    if (resposne.data) {
      const course = resposne.data;
      console.log(course);
      setSelectedCourseId(course._id);
      setSelectedCourseName(course.name);
      setSelectedCourseDescription(course.courseDescription);
      setSelectedCourseDuration(course.duration);
      setSelectedCourseStartTime(course.startTime);
      setSelectedCourseEndTime(course.endTime);
      setSelectedCourseStartDate(course.startDate);
      setSelectedCourseEndDate(course.endDate);
      onOpen();
    }
  };

  return (
    <Card bg={bg} {...rest} p='14px'>
      <ToastContainer />
      <Flex align='center' direction={{ base: "column", md: "row" }}>
        {image && <Image h='80px' w='80px' src={image} borderRadius='8px' me='20px' />}
        <Box mt={{ base: "10px", md: "0" }}>
          <Text
            color={textColorPrimary}
            fontWeight='500'
            fontSize='md'
            mb='4px'>
            {title}
          </Text>
          <Text
            fontWeight='500'
            color={textColorSecondary}
            fontSize='sm'
            me='4px'>
            {type.charAt(0).toUpperCase() + type.slice(1)} #{ranking} •{" "}
            <Text fontWeight='500' color={brandColor} onClick={showCourseDetails} fontSize='sm'>
              See {type} details and Update
            </Text>
          </Text>
        </Box>
      </Flex>
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update your Course</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Course name</FormLabel>
              <Input value={selectedCourseName} ref={initialRef} placeholder='Painting course' color={textColorPrimary} onChange={e => setSelectedCourseName(e.target.value)} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Course Desciption</FormLabel>
              <Input value={selectedCourseDescription} placeholder='Course Desciption' color={textColorPrimary} onChange={e => setSelectedCourseDescription(e.target.value)} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Course Start Date</FormLabel>
              <Input value={selectedCourseStartDate} type='date' placeholder='' color={textColorPrimary} onChange={e => setSelectedCourseStartDate(e.target.value)} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Course Start Time</FormLabel>
              <Input value={selectedCourseStartTime} type='time' placeholder='S, T, T 10:00-11:00 A.M' color={textColorPrimary} onChange={e => setSelectedCourseStartTime(e.target.value)} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Course End Date</FormLabel>
              <Input value={selectedCourseEndDate} type='date' placeholder='' color={textColorPrimary} onChange={e => setSelectedCourseEndDate(e.target.value)} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Course End Time</FormLabel>
              <Input value={selectedCourseEndTime} type='time' placeholder='S, T, T 10:00-11:00 A.M' color={textColorPrimary} onChange={e => setSelectedCourseEndTime(e.target.value)} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Course Duration in mintues</FormLabel>
              <Input value={selectedCourseDuration} type='number' placeholder='60' color={textColorPrimary} onChange={e => setSelectedCourseDuration(e.target.value)} />
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
              <Checkbox colorScheme="green" isChecked={selectedCourseIsPublic} onChange={e => setSelectedCourseIsPublic(e.target.checked)}>Check this box if you want your course to be PUBLIC</Checkbox>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose} mr={3} background="red">Discard</Button>
            <Button colorScheme='blue' mr={3} onClick={updateCourse}>Update</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Card>
  );
}
