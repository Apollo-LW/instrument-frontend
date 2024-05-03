// Chakra imports
import { SimpleGrid, Text, useColorModeValue } from "@chakra-ui/react";
import axios from "axios";
// Custom components
import Card from "components/card/Card.js";
import React, { useEffect, useState } from "react";
import Information from "views/admin/profile/components/Information";

// Assets
export default function GeneralInformation(props) {

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const fetchProfile = async () => {
    const response = await axios.get(`http://localhost:3000/user/${localStorage.getItem("userId")}`, {
      headers: {
        "Authorization" : `Bearer ${localStorage.getItem("token")}`,
      }
    });

    const x = response.data;
    if (x) {
      setFirstName(x.firstName);
      setLastName(x.lastName);
      setEmail(x.email);
    }
  };

  const updateFirstName = async () => {
    console.log(updateFirstName);
    const response = await axios.patch(`http://localhost:3000/user/${localStorage.getItem("userId")}`, {
        "firstName": firstName,
    }, {
      "Authorization" : `Bearer ${localStorage.getItem("token")}`,
    });

    const x = response.data;
    if (x) {
      console.log(x);
    }
  }

  const updateLastName = async () => {
    console.log(updateFirstName);
    const response = await axios.patch(`http://localhost:3000/user/${localStorage.getItem("userId")}`, {
        "lastName": lastName,
    }, {
      "Authorization" : `Bearer ${localStorage.getItem("token")}`,
    });

    const x = response.data;
    if (x) {
      console.log(x);
    }
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  const { ...rest } = props;
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "gray.400";
  const cardShadow = useColorModeValue(
    "0px 18px 40px rgba(112, 144, 176, 0.12)",
    "unset"
  );
  return (
    <Card mb={{ base: "0px", "2xl": "20px" }} {...rest}>
      <Text
        color={textColorPrimary}
        fontWeight='bold'
        fontSize='2xl'
        mt='10px'
        mb='4px'>
        General Information
      </Text>
      <Text color={textColorSecondary} fontSize='md' me='26px' mb='40px'>
      "The future belongs to the curious. The ones who are not afraid to try it, explore it, poke at it, question it and turn it inside out"
      </Text>
      <SimpleGrid columns='1' gap='20px'>
        <Information
          boxShadow={cardShadow}
          title='First Name'
          value={firstName}
          onSubmitInfo={updateFirstName}
          setValue={setFirstName}
        />
        <Information
          boxShadow={cardShadow}
          title='Last Name'
          value={lastName}
          onSubmitInfo={updateLastName}
          setValue={setLastName}
        />
        <Information
          boxShadow={cardShadow}
          title='Email'
          value={email}
          onSubmitInfo={updateFirstName}
        />
      </SimpleGrid>
    </Card>
  );
}
