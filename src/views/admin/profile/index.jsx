// Chakra imports
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Box, Button, Grid, useDisclosure } from "@chakra-ui/react";

// Custom components
import Banner from "views/admin/profile/components/Banner";
import General from "views/admin/profile/components/General";
import Projects from "views/admin/profile/components/Projects";
import Storage from "views/admin/profile/components/Storage";
import Upload from "views/admin/profile/components/Upload";

// Assets
import banner from "assets/img/auth/banner.png";
import avatar from "assets/img/avatars/avatar4.png";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

export default function Overview() {
  const [username, setUsername] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef()
  const history = useHistory();

  const fetchFullName = async () => {
    const response = await axios.get(`http://localhost:3000/user/${localStorage.getItem("userId")}`, {
      headers: {
        "Authorization" : `Bearer ${localStorage.getItem("token")}`,
      }
    });

    const x = response.data;
    if (x) {
      setUsername(x.username);
    }
  };

  const deleteAccount = async () => {
    const response = await axios.delete(`http://localhost:3000/user/${localStorage.getItem("userId")}`, {
      headers: {
        "Authorization" : `Bearer ${localStorage.getItem("token")}`,
      }
    });
    if (response.status.toString().startsWith("2")) {
      const x = response.data;
      if (x) {
        console.log(x);
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        history.push('/auth');
      }
    }
  }

  useEffect(() => {
    fetchFullName();
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
          gridArea='1 / 1 / 2 / 2'
          banner={banner}
          avatar={avatar}
          name={username}
        />
        <Storage
          gridArea={{ base: "2 / 1 / 3 / 2", lg: "1 / 2 / 2 / 3" }}
          used={25.6}
          total={50}
        />
        <Upload
          gridArea={{
            base: "3 / 1 / 4 / 2",
            lg: "1 / 3 / 2 / 4",
          }}
          minH={{ base: "auto", lg: "420px", "2xl": "365px" }}
          pe='20px'
          pb={{ base: "100px", lg: "20px" }}
        />
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
          name='Adela Parkson'
          job='Product Designer'
          posts='17'
          followers='9.7k'
          following='274'
        />
        <General
          gridArea={{ base: "2 / 1 / 3 / 2", lg: "1 / 2 / 2 / 3" }}
          minH='365px'
          pe='20px'
        />
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
      </Grid>
    </Box>
  );
}
