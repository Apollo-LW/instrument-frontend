import {
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Icon,
  Input,
  useDisclosure,
  useColorModeValue,
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
  Select
} from "@chakra-ui/react";
import React, { useMemo, useState } from "react";
import axios from "axios";
import { MdCheckCircle, MdCancel, MdOutlineError } from "react-icons/md";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Custom components
import Card from "components/card/Card";
export default function ColumnsTable(props) {
  const { columnsData, tableData, ColumnsTable, currentCourseId, currentCourseName, users } = props;

  const columns = useMemo(() => columnsData, [columnsData]);
  const data = useMemo(() => tableData, [tableData]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [username, setUsername] = useState("");
  const [userRole, setUserRole] = useState("");
  const [error, setError] = useState("");
  const initialRef = React.useRef();
  const finalRef = React.useRef();
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");

  const INSRUMENT_SERVICE = "http://localhost:3000";

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

  const addUser = async (e) => {
    console.log(username);
    if (username === '' || username === ' ') {
      setError("A valid username is required");
      return;
    }

    if (userRole == "") {
      setError("A valid role is required");
      return;
    }

    try {
      const response = await axios.post(`${INSRUMENT_SERVICE}/course/user/${username}`, {
        "courseId": currentCourseId,
        "role": userRole,
      }, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        }
      });
      console.log(response.data);
      tableData.push(response.data);
      showToastMessage("Successfully added user " + username + " to course " + currentCourseName, true);
      onClose();
      setError("");
    } catch (error) {
      showToastMessage("Failed to add user " + username + " to course " + currentCourseName, false);
      setError(error.response.data.message);
    }
  }


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
          Course <Text display='inline-block' color="green">{currentCourseName ? currentCourseName : ""} </Text> Users Table
        </Text>
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
                  if (cell.column.Header === "USERNAME") {
                    data = (
                      <Flex align='center'>
                        <Text color={textColor} fontSize='sm' fontWeight='700'>
                          {cell.value}
                        </Text>
                      </Flex>
                    );
                  } else if (cell.column.Header === "ROLE") {
                    data = (
                      <Flex align='center'>
                        <Icon
                          w='24px'
                          h='24px'
                          me='5px'
                          color={cell.value === "admin" || cell.value === "owner" ? "green.500" : "orange.500"}
                          as={cell.value === "admin" || cell.value === "owner" ? MdCheckCircle : MdCancel}
                        />
                        <Text color={textColor} fontSize='sm' fontWeight='700'>
                          {cell.value}
                        </Text>
                      </Flex>
                    );
                  } else if (cell.column.Header === "Last Role Update") {
                    data = (
                      <Text color={textColor} fontSize='sm' fontWeight='700'>
                        {new Date(cell.value).toLocaleString()}
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
      {currentCourseId != 0 && <Button
        me='100%'
        mb='50px'
        w='190px'
        minW='140px'
        m='25px'
        mt={{ base: "20px", "2xl": "auto" }}
        variant='brand'
        background="Green"
        onClick={onOpen}
        fontWeight='500'>
        Add/Update User
      </Button>}
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add/Update a User to the course</ModalHeader>
          {error && <div margin='20px' style={{ color: "red" }}>{error}</div>}{" "}
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Username</FormLabel>
              <Input ref={initialRef} placeholder='MrMoon' color={textColorPrimary} onChange={e => setUsername(e.target.value)}/>
            </FormControl>

            <FormControl mt={4}>
              <Select placeholder='User Role' color={textColorPrimary} onChange={e => setUserRole(e.target.options[e.target.selectedIndex].value)}>
                <option color={textColorPrimary} value='admin'>Admin</option>
                <option value='student'>Student</option>
              </Select>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose} mr={3} background="red">Discard</Button>
            <Button colorScheme='blue' mr={3} onClick={addUser}>Add</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Card>
  );
}
