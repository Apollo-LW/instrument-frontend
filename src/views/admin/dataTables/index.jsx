// Chakra imports
import { Box, Button, Menu, MenuButton, MenuItem, MenuList, SimpleGrid, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import { ChevronDownIcon } from '@chakra-ui/icons'
import DevelopmentTable from "views/admin/dataTables/components/DevelopmentTable";
import CheckTable from "views/admin/dataTables/components/CheckTable";
import ColumnsTable from "views/admin/dataTables/components/ColumnsTable";
import ComplexTable from "views/admin/dataTables/components/ComplexTable";
import {
  columnsDataDevelopment,
  columnsDataCheck,
  columnsDataColumns,
  columnsDataComplex,
} from "views/admin/dataTables/variables/columnsData";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

export default function Settings() {

  const history = useHistory();
  const INSRUMENT_SERVICE = "http://localhost:3000";
  const textColorSecondary = "gray.400";
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  
  const [courses, setCourses] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedCourseTasks, setSelectedCourseTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [files, setFiles] = useState([]);

  const [selectedCourseId, setSelectedCourseId] = useState(0);
  const [selectedCourseName, setSelectedCourseName] = useState("");
  const [selectedCourseDescription, setSelectedCourseDescription] = useState("");
  const [selectedCourseDuration, setSelectedCourseDuration] = useState("");
  const [selectedCourseStartTime, setSelectedCourseStartTime] = useState("");
  const [selectedCourseEndTime, setSelectedCourseEndTime] = useState("");
  const [selectedCourseStartDate, setSelectedCourseStartDate] = useState("");
  const [selectedCourseEndDate, setSelectedCourseEndDate] = useState("") 
  const [selectedCourseRepeated, setSelectedCourseRepeated] = useState([]);
  const [selectedCourseFiles, setSelectedCourseFiles] = useState([]);

  const fetchSelectedCourse = async (courseId) => {
    if (courseId == 0) {
      return;
    }

    const response = await axios.get(`${INSRUMENT_SERVICE}/course/${courseId}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      }
    });

    if (response.status == 401) {
      history.push("/auth");
      return;
    }

    if (response.data) {
      const course = response.data;
      console.log(course);
      setSelectedCourseId(course._id);
      setSelectedCourseName(course.name);
      setSelectedCourseDescription(course.courseDescription);
      setSelectedCourseDuration(course.duration);
      setSelectedCourseStartTime(course.startTime);
      setSelectedCourseEndTime(course.endTime);
      setSelectedCourseStartDate(course.startDate);
      setSelectedCourseEndDate(course.endDate);
      setSelectedCourseRepeated(course.repeatedDays);
    }
  }

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

  const fetchCourseTasks = async () => {
    if (selectedCourseId == 0) {
      return;
    }

    const response = await axios.get(`${INSRUMENT_SERVICE}/course/list/task/${selectedCourseId}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      }
    });

    if (response.status == 401) {
      history.push("/auth");
      return;
    }

    if (response.data) {
      setSelectedCourseTasks(response.data);
    }
  }

  const fetchUserTasks = async () => {
    const response = await axios.get(`${INSRUMENT_SERVICE}/task/user/list/${localStorage.getItem("userId")}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      }
    });

    if (response.status == 401) {
      history.push("/auth");
      return;
    }

    if (response.data) {
      setTasks(response.data);
    }
  };

  const fetchCourseUsernames = async () => {
    if (selectedCourseId == 0) {
      return;
    }

    const response = await axios.get(`${INSRUMENT_SERVICE}/course/list/users/${selectedCourseId}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      }
    });

    if (response.status == 401) {
      history.push("/auth");
      return;
    }

    if (response.data) {
      setUsers(response.data);
    }
  };

  const fetchUserFiles = async () => {
    if (selectedCourseId == 0) {
      return;
    }

    const response = await axios.get(`${INSRUMENT_SERVICE}/asset/list/${localStorage.getItem("userId")}`, {
      headers: {
        "Authorization" : `Bearer ${localStorage.getItem("token")}`,
      }
    });

    if (response.data) {
      console.log(response.data);
      setFiles(response.data);
    }
  };

  const fetchCourseFiles = async () => {
    if (selectedCourseId == 0) {
      return;
    }

    const response = await axios.get(`${INSRUMENT_SERVICE}/course/list/asset/${selectedCourseId}`, {
      headers: {
        "Authorization" : `Bearer ${localStorage.getItem("token")}`,
      }
    });

    if (response.data) {
      setSelectedCourseFiles(response.data);
    }
  }


  useEffect(() => {
    fetchUserCourses();
    fetchUserTasks();
    fetchCourseTasks();
    fetchCourseUsernames();
    fetchUserFiles();
    fetchCourseFiles();
  }, [selectedCourseId]);

  // Chakra Color Mode
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Menu m='25px'>
        <MenuButton m='25px' as={Button} rightIcon={<ChevronDownIcon />}>
          Select Course
        </MenuButton>
        <MenuList>
          {courses.map((course) => (
              <MenuItem onClick={() => fetchSelectedCourse(course._id)} key={course._id}>{course.name}</MenuItem>
            ))}
        </MenuList>
      </Menu>
      {
        selectedCourseId != 0 && (
        <Flex m='20px' w='max-content' mx='auto' mt='26px'>
          <Flex mx='auto' me='60px' align='center' direction='column'>
            <Text color='green' fontSize='2xl' fontWeight='700'>
              {selectedCourseName}
            </Text>
            <Text color={textColorSecondary} fontSize='sm' fontWeight='400'>
              {selectedCourseDescription}
            </Text>
          </Flex>
          <Flex me='60px' mx='auto' align='center' direction='column'>
            <Text color={textColorPrimary} fontSize='2xl' fontWeight='700'>
              {selectedCourseStartTime} - {selectedCourseEndTime}
            </Text>
            <Text color={textColorSecondary} fontSize='sm' fontWeight='400'>  
              {selectedCourseRepeated.toString()}
            </Text>
          </Flex>
          <Flex mx='auto' ms='60px' align='center' direction='column'>
            <Text color={textColorPrimary} fontSize='2xl' fontWeight='700'>
              {selectedCourseStartDate.substring(0, 10)}
            </Text>
            <Text color={textColorSecondary} fontSize='sm' fontWeight='400'>
              {selectedCourseEndDate.substring(0, 10)}
            </Text>
          </Flex>
        </Flex>)
      }
      <SimpleGrid
        mb='20px'
        columns={{ sm: 1, md: 2 }}
        spacing={{ base: "20px", xl: "20px" }}>
        <CheckTable columnsData={columnsDataCheck} tableData={tasks} />
        <DevelopmentTable 
          currentCourseName={selectedCourseName}
          currentCourseId={selectedCourseId}
          columnsData={columnsDataDevelopment}
          userTasksToAdd={tasks.map(task => ({
              name: task.name,
              id: task._id
            }))}
            currentCourseTask={selectedCourseTasks}
        />
        <ColumnsTable
          currentCourseId={selectedCourseId}
          currentCourseName={selectedCourseName}
          columnsData={columnsDataColumns}
          tableData={users}
        />
        <ComplexTable
          currentCourseId={selectedCourseId}
          currentCourseName={selectedCourseName}
          columnsData={columnsDataComplex}
          tableData={selectedCourseFiles}
          userAssetsToAdd={files}
        />
      </SimpleGrid>
    </Box>
  );
}
