// Chakra imports
import {
  Box,
  Flex,
  Icon,
  SimpleGrid,
  useColorModeValue,
} from "@chakra-ui/react";
import axios from "axios";
// Assets
// Custom components
import MiniCalendar from "components/calendar/MiniCalendar";
import MiniStatistics from "components/card/MiniStatistics";
import IconBox from "components/icons/IconBox";
import { AuthContext } from "contexts/AuthContext";
import React, { useContext, useEffect, useState } from "react";
import {
  MdAddTask,
  MdFileCopy,
} from "react-icons/md";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import ComplexTable from "views/admin/default/components/ComplexTable";
import Tasks from "views/admin/default/components/Tasks";
import TotalSpent from "views/admin/default/components/TotalSpent";
import WeeklyRevenue from "views/admin/default/components/WeeklyRevenue";
import { columnsDataCheckExam } from "views/admin/dataTables/variables/columnsData";
import tableDataComplex from "views/admin/default/variables/tableDataComplex.json";

export default function UserReports() {
  // Chakra Color Mode
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");

  const history = useHistory();
  const [numberOfCourses, setNumberOfCourses] = useState(0);
  const [numberOfDocuments, setNumberOfDocuments] = useState(0);
  const [numberOfTaskDoneLastMonth, setNumberOfTaskDoneLastMonth] = useState(0);
  const [numberOfTaskDue, setNumberOfTaskDue] = useState(0);
  const [exams, setExams] = useState([]);
  const { token, loading } = useContext(AuthContext);

  const fetchNumberOfCourses = async () => {
    try {
      if (localStorage.getItem("token") != null) {
          const response = await axios.get(`http://localhost:3000/course/user/${localStorage.getItem("userId")}`, {
          headers: {
            "Authorization" : `Bearer ${localStorage.getItem("token")}`,
          }
        });
        const x = response.data;
        if (x) {
          setNumberOfCourses(x);
        } 
      } else {
        history.push('auth');
      }
    } catch (e) {
      console.log(e);
    }
  };

  const fetchNumberOfDocuments = async () => {
    try {
      if (localStorage.getItem("token") != null) {
          const response = await axios.get(`http://localhost:3000/asset/count/${localStorage.getItem("userId")}`, {
          headers: {
            "Authorization" : `Bearer ${localStorage.getItem("token")}`,
          }
        });
        const x = response.data;
        if (x) {
          setNumberOfDocuments(x);
        } 
      } else {
        history.push('auth/sign-in');
      }
    } catch (e) {
      console.log(e);
    }
  };

  const fetchNumberOfTaskDoneLastMonth = async () => {
    try {
      if (localStorage.getItem("token") != null) {
          const response = await axios.get(`http://localhost:3000/task/count/${localStorage.getItem("userId")}`, {
          headers: {
            "Authorization" : `Bearer ${localStorage.getItem("token")}`,
          }
        });
        const x = response.data;
        if (x) {
          const y = x.reduce((sum, x) => sum + x, 0);
          setNumberOfTaskDoneLastMonth(y);
        } 
      } else {
        history.push('auth/sign-in');
      }
    } catch (e) {
      console.log(e);
    }
  };

  const fetchTaskDueInWeek = async () => {
    try {
      if (localStorage.getItem("token") != null) {
          const response = await axios.get(`http://localhost:3000/task/count/due/${localStorage.getItem("userId")}`, {
          headers: {
            "Authorization" : `Bearer ${localStorage.getItem("token")}`,
          }
        });
        const x = response.data;
        if (x) {
          const y = x.reduce((sum, x) => sum + x, 0);
          setNumberOfTaskDue(y);
        } 
      } else {
        history.push('auth/sign-in');
      }
    } catch (e) {
      console.log(e);
    }
  };

  const fetchUserExams = async () => {
    const response = await axios.get(`http://localhost:3000/task/user/exam/${localStorage.getItem("userId")}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      }
    });

    if (response.status == 401) {
      history.push("/auth");
      return;
    }

    if (response.data) {
      const x = response.data;
      const y = x.filter(x => x != null);
      console.log(y);
      setExams(y);
      console.log(response.data);
    }
  };


  useEffect(() => {
    fetchNumberOfCourses();
    fetchNumberOfDocuments();
    fetchNumberOfTaskDoneLastMonth();
    fetchTaskDueInWeek();
    fetchUserExams();
  }, []);

  if (loading) {
    return null;
  }

  if (!token) {
    history.push("/auth");
  }

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 3, "2xl": 4 }}
        gap='20px'
        mb='20px'>
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={
                <Icon w='32px' h='32px' as={MdFileCopy} color={brandColor} />
              }
            />
          }
          name='Total Documents'
          value={numberOfDocuments}
        />
        <MiniStatistics growth='+23%' name='Tasks Done' value={numberOfTaskDoneLastMonth} />
        <MiniStatistics
          endContent={
            <Flex me='-16px' mt='10px'>
            </Flex>
          }
          name='2024 Courses'
          value={numberOfCourses}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg='linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)'
              icon={<Icon w='28px' h='28px' as={MdAddTask} color='white' />}
            />
          }
          name='Tasks due in 7 days'
          value={numberOfTaskDue}
        />
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap='20px' mb='20px'>
        <TotalSpent />
        <WeeklyRevenue />
      </SimpleGrid>
      <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap='20px' mb='20px'>
        <ComplexTable
          columnsData={columnsDataCheckExam}
          tableData={exams}
        />
        <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap='20px'>
          <Tasks />
          <MiniCalendar h='100%' minW='100%' selectRange={false} />
        </SimpleGrid>
      </SimpleGrid>
    </Box>
  );
}
