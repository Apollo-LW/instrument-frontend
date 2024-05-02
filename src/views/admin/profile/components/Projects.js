// Chakra imports
import { Text, useColorModeValue } from "@chakra-ui/react";
// Assets
import Project1 from "assets/img/profile/Project1.png";
import Project2 from "assets/img/profile/Project2.png";
import Project3 from "assets/img/profile/Project3.png";
import axios from "axios";
// Custom components
import Card from "components/card/Card.js";
import React, { useEffect, useState } from "react";
import Project from "views/admin/profile/components/Project";

export default function Projects(props) {
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "gray.400";
  const cardShadow = useColorModeValue(
    "0px 18px 40px rgba(112, 144, 176, 0.12)",
    "unset"
  );
  const pics = [Project1, Project2, Project3];

  const [courses, setCourses] = useState([]);

  const fetchUserCourses = async () => {
    const response = await axios.get(`http://localhost:3000/course/user/list/${localStorage.getItem("userId")}`, {
      headers: {
        "Authorization" : `Bearer ${localStorage.getItem("token")}`,
      }
    });
    if (response.status == 401) {
      return;
    }
    const x = response.data;
    if (x) {
      setCourses(x);
    }
  };

  useEffect(() => {
    fetchUserCourses();
  }, []);

  return (
    <Card mb={{ base: "0px", "2xl": "20px" }}>
      <Text
        color={textColorPrimary}
        fontWeight='bold'
        fontSize='2xl'
        mt='10px'
        mb='4px'>
        All Courses
      </Text>
      <Text color={textColorSecondary} fontSize='md' me='26px' mb='40px'>
        Dive deeper into your coursework! Here you'll find all the information you need to thrive, in-depth course descriptions.
      </Text>
      {
        courses.map((course, index) =>
          <div key={index}>
            <Project 
              ranking={index+1}
              title={course.name}
              link='#'
              boxShadow={cardShadow}
              mb='20px'
              image={pics[index%3]}
            />
          </div>
        )
      }
    </Card>
  );
}
