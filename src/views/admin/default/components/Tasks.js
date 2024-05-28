// Chakra imports
import {
  Box,
  Flex,
  Text,
  Icon,
  useColorModeValue,
  Checkbox,
} from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";
import Menu from "components/menu/MainMenu";
import IconBox from "components/icons/IconBox";
import axios from "axios";


// Assets
import { MdCheckBox, MdDragIndicator } from "react-icons/md";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

export default function Conversion(props) {
  const { ...rest } = props;

  const INSRUMENT_SERVICE = "http://localhost:3000";
  const [tasks, setTasks] = useState([]);
  const history = useHistory();

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

  useEffect(() => {
    fetchUserTasks();
  }, []);

  // Chakra Color Mode
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "navy.700");
  const brandColor = useColorModeValue("brand.500", "brand.400");
  return (
    <Card p='20px' align='center' direction='column' w='100%' {...rest}>
      <Flex alignItems='center' w='100%' mb='30px'>
        <IconBox
          me='12px'
          w='38px'
          h='38px'
          bg={boxBg}
          icon={<Icon as={MdCheckBox} color={brandColor} w='24px' h='24px' />}
        />

        <Text color={textColor} fontSize='lg' fontWeight='700'>
          Tasks
        </Text>
      </Flex>
      <Box px='11px'>
        {
          tasks.map((task, idx) => {
            return <Flex mb='20px'>
              <Checkbox me='16px' colorScheme='brandScheme' />
              <Text
                key={idx + 1}
                fontWeight='bold'
                color={textColor}
                fontSize='md'
                textAlign='start'>
                {task.name}
              </Text>
              <Icon
                ms='auto'
                as={MdDragIndicator}
                color='secondaryGray.600'
                w='24px'
                h='24px'/>
            </Flex>
          })
        }
      </Box>
    </Card>
  );
}
