// Chakra imports
import { Box, Button, Menu, MenuButton, MenuItem, MenuList, SimpleGrid } from "@chakra-ui/react";
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
import tableDataDevelopment from "views/admin/dataTables/variables/tableDataDevelopment.json";
import tableDataCheck from "views/admin/dataTables/variables/tableDataCheck.json";
import tableDataColumns from "views/admin/dataTables/variables/tableDataColumns.json";
import tableDataComplex from "views/admin/dataTables/variables/tableDataComplex.json";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

export default function Settings() {

  const history = useHistory();
  const INSRUMENT_SERVICE = "http://localhost:3000";
  const [courses, setCourses] = useState([]);
  const [tasks, setTasks] = useState([]);

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
      console.log(response.data);
      setTasks(response.data);
    }
  }

  useEffect(() => {
    fetchUserCourses();
    fetchUserTasks();
  }, []);

  // Chakra Color Mode
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Menu m={10}>
        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
          Your Courses
        </MenuButton>
        <MenuList>
          {courses.map((course) => (
              <MenuItem key={course._id}>{course.name}</MenuItem>
            ))}
        </MenuList>
      </Menu>
      <SimpleGrid
        mb='20px'
        columns={{ sm: 1, md: 2 }}
        spacing={{ base: "20px", xl: "20px" }}>
        <DevelopmentTable 
          columnsData={columnsDataDevelopment}
          tableData={tableDataDevelopment}
        />
        <CheckTable columnsData={columnsDataCheck} tableData={tableDataCheck} />
        <ColumnsTable
          columnsData={columnsDataColumns}
          tableData={tableDataColumns}
        />
        <ComplexTable // Course Task list
          columnsData={columnsDataComplex}
          tableData={tableDataComplex}
        />
      </SimpleGrid>
    </Box>
  );
}
