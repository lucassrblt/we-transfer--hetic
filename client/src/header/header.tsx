import {
    Box,
    Button,
    Flex,
    HStack,
    MenuItem,
  } from "@chakra-ui/react";
  import { FC } from "react";
  import { useAuth } from "@/context/AuthContext";
import { LinkButton } from "@/components/ui/link-button";
import { MenuContent, MenuRoot, MenuTrigger } from "@/components/ui/menu";
import { Avatar } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { DOWNLOAD, FILES, LOGIN, TRANSFER } from "@/constants/Routes";
import { GoUpload } from "react-icons/go";
  
  const Header: FC = () => {
    const { user,logout } = useAuth();
    const navigate = useNavigate();
    const location = window.location.pathname;  
    return (
      <Box as="header"  color={"gray-800"} px={8} py={4} position={"fixed"} top={0} left={0} right={0} zIndex={100}>
        <Flex align="center" justify="flex-end" gap={2}>
        <HStack bg={"white"} p={1} rounded="2xl">
          <Button
            colorScheme="whiteAlpha"
            color={"gray-600"}
            _hover={{ bg: "green.200" }}
            bg={location ===DOWNLOAD ? "green.400" : "white"}
            rounded="xl"
            onClick={() => navigate("/download")}
          >
            Download
          </Button>
          {user && (
            <HStack>
                 <Button
            colorScheme="whiteAlpha"
            color={"gray-600"}
            _hover={{ bg: "green.200" }}
            bg={location === TRANSFER ? "green.400" : "white"}
            rounded="xl"
            onClick={() => navigate(TRANSFER)}
          >
            Upload <GoUpload/>
          </Button>
            <MenuRoot>
            <MenuTrigger asChild>
                <Button  colorScheme="whiteAlpha"
                color={"gray-700"}
                bg="green.400"
                _hover={{ bg: "gray.400" }}
                paddingRight={0}
                rounded="2xl"  size="sm">
                      {user.name} <Avatar marginLeft={'auto'} size="xs" name={user.name}  />
                    </Button>
                  </MenuTrigger>
                  <MenuContent>
                    <MenuItem
                      value="delete"
                      color="fg.error"
                      _hover={{ bg: "bg.error", color: "fg.error" }}
                      cursor={"pointer"}
                      onClick={logout}
                    >
                     Logout...
                    </MenuItem>
                  </MenuContent>
                  <Button
                    colorScheme="whiteAlpha"
                    _hover={{ bg: "green.200" }}
                    rounded="xl"
                    color={"gray.900"}
                    bg={location === FILES ? "green.400" : "white"}
                    onClick={() => navigate(FILES)}
                    >
                        My files
                    </Button>
                </MenuRoot></HStack>
          )}
        </HStack>
         {!user && <HStack bg={"white"} p={1} rounded="2xl">
          

            <Button
              colorScheme="whiteAlpha"
              bg="gray.900"
              color={"white"}
              _hover={{ bg: "gray.600" }}
              rounded="xl"
            onClick={() => navigate(LOGIN)}
            >
              Login
            </Button>
          </HStack>}
        </Flex>
      </Box>
    );
  };
  
  export default Header;