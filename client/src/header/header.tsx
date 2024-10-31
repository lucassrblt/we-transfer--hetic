import {
    Box,
    Button,
    Flex,
    HStack,
    Menu,
    MenuItem,
    Link,
  } from "@chakra-ui/react";
  import { ChevronDownIcon } from "@chakra-ui/icons";
  import { FC } from "react";
  import { useAuth } from "@/context/AuthContext";
import { LinkButton } from "@/components/ui/link-button";
import { CgUser } from "react-icons/cg";
import { FaUser } from "react-icons/fa";
  
  const Header: FC = () => {
    const { user } = useAuth();
    return (
      <Box as="header"  color={"gray-800"} px={8} py={4} position={"fixed"} top={0} left={0} right={0} zIndex={100}>
        <Flex align="center" justify="flex-end" gap={2}>
        <HStack bg={"white"} p={1} rounded="2xl">
          <Button
            colorScheme="whiteAlpha"
            color={"gray-600"}
            _hover={{ bg: "green.200" }}
            rounded="xl"
          >
            Transfer
          </Button>
          {user && (
              <Button
                colorScheme="whiteAlpha"
                color={"gray-700"}
                bg="green.400"
                _hover={{ bg: "gray.200" }}
                rounded="xl"
              >
                {user.name} <FaUser style={{width:"12px"}}/>
              </Button>
          )}
        </HStack>
          <HStack bg={"white"} p={1} rounded="2xl">
          
            <LinkButton href="#" color={"gray-900"} fontWeight="medium" _hover={{ color: "gray.600" }}>
              Login
            </LinkButton>
            <Button
              colorScheme="whiteAlpha"
              bg="gray.900"
              color={"white"}
              _hover={{ bg: "gray.600" }}
              rounded="xl"
            >
              Sign Up
            </Button>
          </HStack>
        </Flex>
      </Box>
    );
  };
  
  export default Header;