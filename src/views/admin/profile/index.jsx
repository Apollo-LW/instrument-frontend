// Chakra imports
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Box, Button, Grid, Image, SimpleGrid, useDisclosure } from "@chakra-ui/react";

// Custom components
import Banner from "views/admin/profile/components/Banner";
import General from "views/admin/profile/components/General";
import Projects from "views/admin/profile/components/Projects";
import Storage from "views/admin/profile/components/Storage";
import Upload from "views/admin/profile/components/Upload";
import ComplexTable from "views/admin/dataTables/components/ComplexTable";

// Assets
import banner from "assets/img/auth/banner.png";
import avatar from "assets/img/avatars/avatar4.png";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import {
  columnsDataDevelopment,
  columnsDataCheck,
  columnsDataColumns,
  columnsDataComplex,
} from "views/admin/dataTables/variables/columnsData";
import tableDataComplex from "views/admin/dataTables/variables/tableDataComplex.json";

export default function Overview() {
  const INSRUMENT_SERVICE = "http://localhost:3000";
  const [username, setUsername] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef()
  const history = useHistory();
  const [images, setImages] = useState([]);
  const [storageUsage, setStorageUsage] = useState(0);

  const fetchUsername = async () => {
    const response = await axios.get(`${INSRUMENT_SERVICE}/user/${localStorage.getItem("userId")}`, {
      headers: {
        "Authorization" : `Bearer ${localStorage.getItem("token")}`,
      }
    });

    if (response.data) {
      setUsername(response.data.username);
    }
  };

  const fetchImages = async () => {
    const response = await axios.get(`${INSRUMENT_SERVICE}/asset/list/${localStorage.getItem("userId")}`, {
      headers: {
        "Authorization" : `Bearer ${localStorage.getItem("token")}`,
      }
    });

    if (response.data) {
      setImages(response.data);
    }
  };

  const fetchStorageUsage = async () => {
    const response = await axios.get(`${INSRUMENT_SERVICE}/asset/size/${localStorage.getItem("userId")}`, {
      headers: {
        "Authorization" : `Bearer ${localStorage.getItem("token")}`,
      }
    });

    if (response.data) {
      setStorageUsage(response.data);
    }
  }

  const deleteAccount = async () => {
    const response = await axios.delete(`${INSRUMENT_SERVICE}/user/${localStorage.getItem("userId")}`, {
      headers: {
        "Authorization" : `Bearer ${localStorage.getItem("token")}`,
      }
    });
    if (response.status.toString().startsWith("2")) {
      if (response.data) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        history.push('/auth');
      }
    }
  };

  useEffect(() => {
    fetchUsername();
    fetchImages();
    fetchStorageUsage();
  }, []);

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      {/* Main Fields */}
      <Grid
        templateColumns={{
          base: "1fr",
          lg: "1.34fr 1fr 1.62fr",
        }}
        templateRows={{
          base: "repeat(3, 1fr)",
          lg: "1fr",
        }}
        gap={{ base: "20px", xl: "20px" }}>
        <Banner
          gridArea='1 / 1 / 2 / 4'
          banner={banner}
          avatar={avatar}
          name={username}
        />
        <SimpleGrid
          gridArea={{ base: "2 / 1 / 3 / 2", lg: "1 / 5 / 5 / 2" }}
          minChildWidth="150px"
          spacing="40px"zes
          maxW="xl"
          alignItems="center"
          justifyContent="center"
          margin="100px auto">
          <Box>
            {/* <Image src="https://bit.ly/dan-abramov" alt="Dan Abramov" /> */}
          </Box>
        </SimpleGrid>
      </Grid>
      <Grid
        templateColumns={{
          base: "1fr",
          lg: "1.34fr 1fr 1.62fr",
        }}
        templateRows={{
          base: "repeat(3, 1fr)",
          lg: "1fr",
        }}
        gap={{ base: "20px", xl: "20px" }}>
        <Upload gridArea={{ base: "2 / 1 / 3 / 2", lg: "1 / 5 / 5 / 1" }}/>
      </Grid>
      <Grid
        mb='20px'
        templateColumns={{
          base: "1fr",
          lg: "repeat(2, 1fr)",
          "2xl": "1.34fr 1.62fr 1fr",
        }}
        templateRows={{
          base: "1fr",
          lg: "repeat(2, 1fr)",
          "2xl": "1fr",
        }}
        gap={{ base: "20px", xl: "20px" }}>
        <Projects
          gridArea='1 / 2 / 2 / 2'
          banner={banner}
          avatar={avatar}
        />
        <General
          gridArea={{ base: "2 / 1 / 3 / 2", lg: "1 / 2 / 2 / 3" }}
          minH='365px'
          pe='20px'
        />
        <Storage
          gridArea={{ base: "2 / 1 / 3 / 2", lg: "1 / 2 / 2 / 3" }}
          used={storageUsage}
          total={50}
        />
      </Grid>
      <Button
          me='100%'
          mb='50px'
          w='340px'
          minW='340px'
          mt={{ base: "20px", "2xl": "auto" }}
          variant='brand'
          onClick={onOpen}
          background="red"
          fontWeight='500'>
          Delete Account
      </Button>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Delete Customer
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme='red' onClick={deleteAccount} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}
