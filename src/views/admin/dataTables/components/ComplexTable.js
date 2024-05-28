import {
  Flex,
  Table,
  Progress,
  Icon,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  ModalFooter,
  Input,
  Select,
  Menu, 
  MenuButton, 
  MenuItem, 
  MenuList,
} from "@chakra-ui/react";
import React, { useMemo, useState } from "react";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";

// Custom components
import Card from "components/card/Card";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Assets
import { ChevronDownIcon } from '@chakra-ui/icons'
import axios from "axios";

export default function ColumnsTable(props) {
  const { columnsData, tableData, currentCourseId, currentCourseName, userAssetsToAdd } = props;
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "gray.400";
  const cardShadow = useColorModeValue(
    "0px 18px 40px rgba(112, 144, 176, 0.12)",
    "unset"
  );
  const INSRUMENT_SERVICE = "http://localhost:3000";

  const columns = useMemo(() => columnsData, [columnsData]);
  const data = useMemo(() => tableData, [tableData]);

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
  initialState.pageSize = 5;


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


  const addAsset = async (courseId, fileId) => {
    try {
      const response = await axios.post(`${INSRUMENT_SERVICE}/course/asset`, {
        "courseId": courseId,
        "userId": localStorage.getItem('userId'),
        "assetId": fileId
      }, {
        headers: {
          "Authorization" : `Bearer ${localStorage.getItem("token")}`,
        }
      });

      if (response.data) {
        showToastMessage("Asset Added Successfully!!", true);
      }
    } catch (err) {
      console.log(err);
      showToastMessage("Asset Failed to Add", false);
    }
  };

  const fetchUser = async (userId) => {
    try {
      const response = await axios.get(`${INSRUMENT_SERVICE}/user/${userId}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        }
      });
      return response.data.username;
    } catch (err) {
      console.log(err);
    } 
  };

  const textColor = useColorModeValue("secondaryGray.900", "white");
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
          Course <Text display='inline-block' color="green">{currentCourseName ? currentCourseName : ""} </Text> Assets Table
        </Text>
        {currentCourseId != 0 && <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            Add Assets to your course
          </MenuButton>
          <MenuList>
            {
            userAssetsToAdd.map((file) => (
                <MenuItem onClick={() => addAsset(currentCourseId, file._id)} key={file._id}>{file.name}</MenuItem>
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
                  } else if (cell.column.Header === "SIZE") {
                    data = (
                      <Flex align='center'>
                        <Text color={textColor} fontSize='sm' fontWeight='700'>
                          {(cell.value)/1000} kB
                        </Text>
                      </Flex>
                    );
                  } else if (cell.column.Header === "CREATED AT") {
                    data = (
                      <Text color={textColor} fontSize='sm' fontWeight='700'>
                        {new Date(cell.value).toLocaleDateString(undefined, {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </Text>
                    );
                  } else if (cell.column.Header === "CREATOR") {
                    data = (
                      <Flex align='center'>
                        <Text color={textColor} fontSize='sm' fontWeight='700'>
                          {cell.value}
                        </Text>
                      </Flex>
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
