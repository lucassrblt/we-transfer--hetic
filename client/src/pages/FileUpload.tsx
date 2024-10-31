import { useState } from "react";
import {
  Box,
  Button,
  Input,
  Text,
  IconButton,
  VStack,
  Textarea,

} from "@chakra-ui/react";
import {
  FileUploadList,
  FileUploadRoot,
  FileUploadTrigger,
} from "@/components/ui/file-button"
import { HiUpload } from "react-icons/hi";
import { toaster,Toaster} from "@/components/ui/toaster";
import { BiTransferAlt } from "react-icons/bi";

const FileUpload = () => {
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Handle the file upload
    const file = event.target.files?.[0];
    //checker si la taille du fichier est supérieur à 2Go
    if (file && file.size > 2000000000) {
      toaster.create({ title: "File size exceeded", description: file?.name });
      return;
    }
    toaster.create({ title: "File uploaded", description: file?.name });
  };

  
  return (
    <Box
      border="1px solid"
      borderColor="gray.300"
      borderRadius="xl"
      margin={4}
      marginLeft={20}
      p={4}
      maxH={"50dvh"}
      maxW="300px"
      width={"100%"}
      backgroundColor="white"
      overflowY={"auto"}
      overflowX={"hidden"}
      className="scrollBar"
    >
      <Toaster/>
      <VStack  align="stretch">
        <Text fontSize="lg" fontWeight="bold" color="gray.700">
          Ajouter des fichiers
        </Text>
        <Text fontSize="sm" color="gray.500">
          Jusqu'à 2 Go gratuits
        </Text>

        <Input
          placeholder="Envoyer à (email)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
          variant="flushed" 
          color={'gray.900'}
          border={"0px"}
          bg={'white'}
        />
        <Input
          placeholder="Titre"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          variant="flushed" 
          bg={'white'}
          color={'gray.900'}
          border={"0px"}

        />
        <Textarea
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          variant="flushed" 
          border={"0px"}
          bg={'white'}
          color={'gray.900'}
          borderRadius="xl"

        />

        <Box display="flex" alignItems="start" justifyContent="space-between" 
        >
        <FileUploadRoot maxFiles={5} maxFileSize={2000000000} onChange={handleUpload}>
      <FileUploadTrigger asChild>
        <Button       borderRadius="xl" variant="ghost" size="sm" width={"100%"} color={'gray.100'} bg={'blackAlpha.900'} _hover={{bg: 'gray.100', color: 'blackAlpha.900'}}>
          <HiUpload /> Upload file
        </Button>
      </FileUploadTrigger>
      <FileUploadList  clearable showSize  />
    </FileUploadRoot>

          
        </Box>
        <Button borderRadius="xl"
        colorScheme="purple" bg={'green.500'} color={'white'} _hover={{bg: 'green.400',scale: "1.02"}} width={"100%"} border={"1px solid"} borderColor={'green.500'}>
           <BiTransferAlt/>
            Transférer
          </Button>
      </VStack>
    </Box>
  );
};

export default FileUpload;
