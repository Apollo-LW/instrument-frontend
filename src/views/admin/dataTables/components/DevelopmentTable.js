/* eslint-disable */
import {
  Flex,
  Progress,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Icon,
  Thead,
  Tr,
  useColorModeValue,
  Button,
  Menu, 
  MenuButton, 
  MenuItem, 
  MenuList,
} from "@chakra-ui/react";

import { useToast } from "@chakra-ui/react";

// Custom components
import Card from "components/card/Card";
import { ChevronDownIcon } from '@chakra-ui/icons'
import React, { useEffect, useState, useMemo } from "react";
import { MdCheckCircle, MdCancel, MdOutlineError } from "react-icons/md";
import axios from "axios";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function DevelopmentTable(props) {
  const { columnsData, userTasksToAdd, currentCourseId, currentCourseName, currentCourseTask } = props;
  const INSRUMENT_SERVICE = "http://localhost:3000";

  const columns = useMemo(() => columnsData, [columnsData]);
  const data = useMemo(() => currentCourseTask, [currentCourseTask]);


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

  const addTaskToCourse = async (courseId, taskId) => {
    try {
      const response = await axios.post(`${INSRUMENT_SERVICE}/course/task`, {
        "courseId": courseId,
        "userId": localStorage.getItem("userId"),
        "taskId": taskId
      }, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        }
      });
  
      if (response.status == 401) {
        history.push("/auth");
        return;
      }
      showToastMessage("Task Added Successfully", true);
      currentCourseTask.push(response.data);
    } catch (error) {
      showToastMessage(error.response.data.message, false);
    }
  };

  const tableInstance = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    initialState,
  } = tableInstance;
  initialState.pageSize = 11;

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const iconColor = useColorModeValue("secondaryGray.500", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  return (
    <Card
      direction='column'
      w='100%'
      px='0px'
      overflowX={{ sm: "scroll", lg: "hidden" }}>
      <ToastContainer />
      <Flex px='25px' justify='space-between' mb='20px' align='center'>
        <Text
          color={textColor}
          fontSize='22px'
          fontWeight='700'
          lineHeight='100%'>
          Course <Text display='inline-block' color="green">{currentCourseName ? currentCourseName : ""} </Text> Task Table
        </Text>
        {currentCourseId != 0 && <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            Add Tasks to your course
          </MenuButton>
          <MenuList>
            {userTasksToAdd.map((task) => (
                <MenuItem onClick={() => addTaskToCourse(currentCourseId, task.id)} key={task.id}>{task.name}</MenuItem>
              ))}
          </MenuList>
        </Menu>}
      </Flex>
      <Table {...getTableProps()} variant='simple' color='gray.500' mb='24px'>
        <Thead>
          {headerGroups.map((headerGroup, index) => (
            <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
              {headerGroup.headers.map((column, index) => (
                <Th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  pe='10px'
                  key={index}
                  borderColor={borderColor}>
                  <Flex
                    justify='space-between'
                    align='center'
                    fontSize={{ sm: "10px", lg: "12px" }}
                    color='gray.400'>
                    {column.render("Header")}
                  </Flex>
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody {...getTableBodyProps()}>
          {page.map((row, index) => {
            prepareRow(row);
            return (
              <Tr {...row.getRowProps()} key={index}>
                {row.cells.map((cell, index) => {
                  let data = "";
                  if (cell.column.Header === "NAME") {
                    data = (
                      <Text color={textColor} fontSize='sm' fontWeight='700'>
                        {cell.value}
                      </Text>
                    );
                  } else if (cell.column.Header === "DUE DATE") {
                    data = (
                      <Text color={textColor} fontSize='sm' fontWeight='700'>
                        {new Date(cell.value).toLocaleString()}
                      </Text>
                    );
                  } else if (cell.column.Header === "STATUS") {
                    data = (
                      <Flex align='center'>
                        <Icon
                          w='24px'
                          h='24px'
                          me='5px'
                          color={
                            cell.value === "Finished"
                              ? "green.500"
                              : cell.value === "Almost Done"
                              ? "orange.500"
                              : cell.value === "Not Started"
                              ? "red.500"
                              : null
                          }
                          as={
                            cell.value === "Finished"
                              ? MdCheckCircle
                              : cell.value === "Almost Done"
                              ? MdCancel
                              : cell.value === "Not Started"
                              ? MdOutlineError
                              : null
                          }
                        />
                        <Text color={textColor} fontSize='sm' fontWeight='700'>
                          {cell.value}
                        </Text>
                      </Flex>
                    );
                  } else if (cell.column.Header === "DUE DATE") {
                    data = (
                      <Text color={textColor} fontSize='sm' fontWeight='700'>
                        {new Date(cell.value).toDateString()}
                      </Text>
                    );
                  } else if (cell.column.Header === "DESCRIPTION") {
                    data = (
                      <Text color={textColor} fontSize='sm' fontWeight='700' noOfLines={[1, 2, 3]}>
                        {cell.value}
                      </Text>
                    );
                  }
                  return (
                    <Td
                      {...cell.getCellProps()}
                      key={index}
                      fontSize={{ sm: "14px" }}
                      minW={{ sm: "150px", md: "200px", lg: "auto" }}
                      borderColor='transparent'>
                      {data}
                    </Td>
                  );
                })}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </Card>
  );
}
