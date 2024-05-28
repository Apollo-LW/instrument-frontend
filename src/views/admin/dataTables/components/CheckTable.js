import {
  Flex,
  Table,
  Checkbox,
  Tbody,
  Td,
  Text,
  Th,
  Icon,
  Thead,
  Tr,
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
  Input,
  Select
} from "@chakra-ui/react";
import React, { useMemo, useState } from "react";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";

// Custom components
import { MdCheckCircle, MdCancel, MdOutlineError } from "react-icons/md";
import { EditIcon } from '@chakra-ui/icons'
import Card from "components/card/Card";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CheckTable(props) {
  const { columnsData, tableData } = props;
  const initialRef = React.useRef();
  const finalRef = React.useRef();

  const columns = useMemo(() => columnsData, [columnsData]);
  const data = useMemo(() => tableData, [tableData]);
  const history = useHistory();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");

  const [taskName, setTaskName] = useState("");
  const [taskId, setTaskId] = useState(0);
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("");
  const [desciption, setDesciption] = useState("");
  const [error, setError] = useState("");
  const [taskIsExam, setTaskIsExam] = useState(false);

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

  const createTask = async (e) => {
    if (taskName === '' || taskName === ' ') {
      setError("A valid name is required");
      return;
    }

    try {
      if (taskId == 0) {
        const response = await axios.post(`${INSRUMENT_SERVICE}/task`, {
          "name": taskName,
          "desciption": desciption,
          "dueDate": dueDate,
          "creatorID": localStorage.getItem("userId"),
          "status": status,
          "isExam": taskIsExam
        }, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          }
        });
      } else {
        const response = await axios.patch(`${INSRUMENT_SERVICE}/task/${taskId}`, {
          "name": taskName,
          "desciption": desciption,
          "dueDate": dueDate,
          "creatorID": localStorage.getItem("userId"),
          "status": status,
          "isExam": taskIsExam
        }, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          }
        });
      }
      showToastMessage("Task " + taskName + " created successfully", true);
      onClose();
      setError("");
      setTaskId(0);
    } catch (error) {
      setError(error.response.data.message);
      showToastMessage("Task " + taskName + " failed to be created", false);
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
  initialState.pageSize = 11;

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
          All of Your Created Tasks
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
                  if (cell.column.Header === "NAME") {
                    data = (
                      <Flex align='center'>
                        <Text color={textColor} fontSize='sm' fontWeight='700'>
                          {cell.value}
                        </Text>
                      </Flex>
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
                        {new Date(cell.value).toLocaleString()}
                      </Text>
                    );
                  } else if (cell.column.Header === "DESCRIPTION") {
                    data = (
                      <Text color={textColor} fontSize='sm' fontWeight='700' noOfLines={[1, 2, 3]}>
                        {cell.value}
                      </Text>
                    );
                  } else if (cell.column.Header === "EDIT") {
                    data = (
                      <EditIcon boxSize={6} onClick={() => {
                        const org = row.original;
                        setTaskId(org._id);
                        setTaskName(org.name);
                        setDesciption(org.desciption);
                        setDueDate(org.dueDate);
                        setStatus(org.status);
                        setTaskIsExam(org.isExam);
                        onOpen();
                      }} />
                    )
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
      <Button
        me='100%'
        mb='50px'
        w='140px'
        minW='140px'
        m='25px'
        mt={{ base: "20px", "2xl": "auto" }}
        variant='brand'
        background="Green"
        onClick={onOpen}
        fontWeight='500'>
        Create Task
      </Button>
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create your Task</ModalHeader>
          {error && <div margin='10px' style={{ color: "red" }}>{error}</div>}{" "}
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Task name</FormLabel>
              <Input ref={initialRef} placeholder='Physics Homework' value={taskName} color={textColorPrimary} onChange={e => setTaskName(e.target.value)}/>
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Task Desciption</FormLabel>
              <Input placeholder='Task Desciption' color={textColorPrimary} value={desciption} onChange={e => setDesciption(e.target.value)}/>
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Due Date</FormLabel>
              <Input type='datetime-local' color={textColorPrimary} value={dueDate} onChange={e => setDueDate(e.target.value)} />
            </FormControl>

            <FormControl mt={4}>
              <Select placeholder='Task Status' color={textColorPrimary} value={status} onChange={e => setStatus(e.target.options[e.target.selectedIndex].value)}>
                <option color={textColorPrimary} value='Finished'>Finished</option>
                <option value='Almost Done'>Almost Done</option>
                <option value='Not Started'>Not Started</option>
              </Select>
            </FormControl>

            <FormControl mt={4}>
              <Checkbox colorScheme="green" isChecked={taskIsExam} onChange={e => setTaskIsExam(e.target.checked)}>Check this box if this is an Exam</Checkbox>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose} mr={3} background="red">Discard</Button>
            <Button colorScheme='blue' mr={3} onClick={createTask}>{taskId != 0 ? 'Update' : 'Create'}</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Card>
  );
}
