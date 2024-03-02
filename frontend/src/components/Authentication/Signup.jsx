import React from "react";
import { VStack } from "@chakra-ui/layout";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { Button, FormControl, FormLabel } from "@chakra-ui/react";
import { useState } from "react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import {useNavigate} from "react-router-dom";


const Signup = () => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [confirmpassword, setConfirmpassword] = useState();
  const [password, setPassword] = useState();
  const [pic, setPic] = useState();
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  

  const handleClick = () => setShow(!show);

  const postDetail = (pics) => {
    if (pics === undefined) {
      console.log("No file selected");
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
        status: "warning",
        duration: 9000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    const data = new FormData();
    data.append("file", pics);
    data.append("upload_preset", "chat_app");
    data.append("cloud_name", "dsuqonmk5");

    fetch("https://api.cloudinary.com/v1_1/dsuqonmk5/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
          console.log("Image uploaded successfully. URL:", data.url);
        setPic(data.url.toString());
        setLoading(false);
      })
      .catch((error) => {
         console.error("Error uploading image:", error);;
        toast({
          title: "Image Upload Error",
          description: "There was an error uploading the image",
          status: "error",
          duration: 9000,
          isClosable: true,
          position: "bottom",
        });
        console.log("Please select a valid file type");
        setLoading(false);
      });
  };


  const submitHandler = async() => {
    setLoading(true);
    if(!name || !email || !password || !confirmpassword){
      toast({
        title: "Empty Fields",
        description: "Please fill all the fields",
        status: "warning",
        duration: 9000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return
    }
    if(password !== confirmpassword){
      toast({
        title: "Password Mismatch",
        description: "Password and Confirm Password do not match",
        status: "waring",
        duration: 9000,
        isClosable: true,
        position: "bottom",
      });
     
      return
    }
    try {
      const config= {
        headers: {
          "Content-Type": "application/json"
        
        },
      }
      const {data} = await axios.post('/api/user', {name, email, password, pic}, config);
      toast({
        title: "Account Created",
        description: "Account created successfully",
        status: "success",
        duration: 9000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem('userInfo', JSON.stringify(data));
      setLoading(false);
      navigate('/chats');
    } catch (error) {
      toast({
        title: "Error",
        description: error.response.data.message,
        status: "error",
        duration: 9000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <VStack spacing="5px">
      <FormControl id="first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter your name"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Confirm your password"
            onChange={(e) => setConfirmpassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="pic">
        <FormLabel>Upload Profile Picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetail(e.target.files[0])}
        />
      </FormControl>

      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;
