import React from "react";
import { VStack } from "@chakra-ui/layout";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { Button, FormControl, FormLabel } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const Login = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();
  const handleClick = () => setShow(!show);

  const submitHandler = async() => {
      setLoading(true);
      if(!email || !password){
          toast({
              title: "Please fill out all fields",
              status: "warning",
              duration: 5000,
              isClosable: true,
              position: "bottom"
          });
          setLoading(false);
          return;
      }

      try {
          const config = {
              headers: {
                  "Content-Type": "application/json"
              }
          };

          const { data } = await axios.post(
              "/api/user/login",
              { email, password },
              config
          );
            toast({
                title: `Login Successful, Welcome`,
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
          localStorage.setItem("userInfo", JSON.stringify(data));
          setLoading(false);
          navigate("/chats");
      } catch (error) {
          toast({
              title: "Invalid credentials",
              status: "error",
              description: "Please try again",
              duration: 5000,
              isClosable: true,
              position: "bottom"
          });
          setLoading(false);
      }
  };

  return (
    <VStack spacing="5px">
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Login
      </Button>
      <Button
        variant="solid"
        colorScheme="green"
        width="100%"
        onClick={() => {
          setEmail("guest@exemple.com");
          setPassword("123456");
        }}
      >
        Get Guest Access
      </Button>
    </VStack>
  );
};

export default Login;
