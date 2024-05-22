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
import Card from "components/card/Card";
import Menu from "components/menu/MainMenu";

// Assets
import { MdCheckCircle, MdCancel, MdOutlineError } from "react-icons/md";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";
export default function ColumnsTable(props) {
  const { columnsData, tableData } = props;
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "gray.400";
  const cardShadow = useColorModeValue(
    "0px 18px 40px rgba(112, 144, 176, 0.12)",
    "unset"
  );

  const initialRef = React.useRef();
  const finalRef = React.useRef();
  const history = useHistory();

  const [taskName, setTaskName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const columns = useMemo(() => columnsData, [columnsData]);
  const data = useMemo(() => tableData, [tableData]);
  const INSRUMENT_SERVICE = "http://localhost:3000";
  const { isOpen, onOpen, onClose } = useDisclosure();

  const createTask = async (e) => {
    if (taskName === '' || taskName === ' ') {
      setError("A valid name is required");
      return;
    }

    try {
      const response = await axios.post(`${INSRUMENT_SERVICE}/task`, {
        "name": taskName,
        "description": description,
        "dueDate": dueDate,
        "creatorID": localStorage.getItem("userId"),
        "status": status
      }, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        }
      });
    } catch (error) {
      setError(error.response.data.message);
    }
   

    onClose();
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
      <Flex px='25px' justify='space-between' mb='20px' align='center'>
        <Text
          color={textColor}
          fontSize='22px'
          fontWeight='700'
          lineHeight='100%'>
          Tasks Table
        </Text>
        <Menu />
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
                  } else if (cell.column.Header === "STATUS") {
                    data = (
                      <Flex align='center'>
                        <Icon
                          w='24px'
                          h='24px'
                          me='5px'
                          color={
                            cell.value === "Approved"
                              ? "green.500"
                              : cell.value === "Disable"
                              ? "red.500"
                              : cell.value === "Error"
                              ? "orange.500"
                              : null
                          }
                          as={
                            cell.value === "Approved"
                              ? MdCheckCircle
                              : cell.value === "Disable"
                              ? MdCancel
                              : cell.value === "Error"
                              ? MdOutlineError
                              : null
                          }
                        />
                        <Text color={textColor} fontSize='sm' fontWeight='700'>
                          {cell.value}
                        </Text>
                      </Flex>
                    );
                  } else if (cell.column.Header === "DATE") {
                    data = (
                      <Text color={textColor} fontSize='sm' fontWeight='700'>
                        {cell.value}
                      </Text>
                    );
                  } else if (cell.column.Header === "PROGRESS") {
                    data = (
                      <Flex align='center'>
                        <Progress
                          variant='table'
                          colorScheme='brandScheme'
                          h='8px'
                          w='108px'
                          value={cell.value}
                        />
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
      <Button
        me='100%'
        mb='50px'
        w='140px'
        minW='140px'
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
          {error && <div style={{ color: "red" }}>{error}</div>}{" "}
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Task name</FormLabel>
              <Input ref={initialRef} placeholder='Remind me to clean' color={textColorPrimary} onChange={e => setTaskName(e.target.value)}/>
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Task Desciption</FormLabel>
              <Input placeholder='Task Desciption' color={textColorPrimary} onChange={e => setDescription(e.target.value)}/>
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Due Date</FormLabel>
              <Input type='datetime-local' color={textColorPrimary} onChange={e => setDueDate(e.target.value)} />
            </FormControl>

            <FormControl mt={4}>
              <Select placeholder='Task Status' color={textColorPrimary} onChange={e => setStatus(e.target.options[e.target.selectedIndex].value)}>
                <option value='Finished'>Finished</option>
                <option value='AlmostDone'>Almost Done</option>
                <option value='NotStarted'>Not Started</option>
              </Select>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose} mr={3} background="red">Discard</Button>
            <Button colorScheme='blue' mr={3} onClick={createTask}>Create</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Card>
  );
}
