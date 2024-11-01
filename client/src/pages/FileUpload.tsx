import {useState} from "react";
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
import {HiUpload} from "react-icons/hi";
import {toaster, Toaster} from "@/components/ui/toaster";
import {BiTransferAlt} from "react-icons/bi";
import sendFile from '../functions/sendFile.ts'
import {useAuth} from "@/context/AuthContext.tsx";

const FileUpload = () => {
    const [email, setEmail] = useState("");
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [file, setFile] = useState("");
    const [success, setSuccess] = useState(false)
    const [response, setResponse] = useState("")
    const {user} = useAuth();


    const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        // Handle the file upload
        const file = event.target.files?.[0];
        //checker si la taille du fichier est supérieur à 2Go
        if (file && file.size > 2000000000) {
            toaster.create({title: "File size exceeded", description: file?.name});
            return;
        }
        setFile(file)
        toaster.create({title: "File uploaded", description: file?.name});
    };

    const handleTransfer = async () => {
        const transferObject = {
            email,
            title,
            message
        }
        const response = await sendFile(transferObject, file, user);
        setResponse(response)
        if (response.status === "SUCCESS") {
            setSuccess(true)
            toaster.create({title: "File sent", description: "Your file has been sent successfully"});
        } else {
            toaster.create({title: "Error when sending file", description: "Something went wrong with the transfer"});
        }
        console.log("status", response);
    }

    const copyLink = () => {
        navigator.clipboard.writeText(response.link)
        toaster.create({title: "Link copied", description: "The link has been copied to your clipboard"});
        setResponse("")
        setSuccess(false)
        setEmail("")
        setMessage("")
        setFile("")
        setTitle("")
    }

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
            transform={"translateY(50%)"}
            left={"0"}
            position={"fixed"}
            overflowY={"auto"}
            overflowX={"hidden"}
            className="scrollBar"
        >
            <Toaster/>
            {!success ? (
                <VStack align="stretch">
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
                                <Button borderRadius="xl" variant="ghost" size="sm" width={"100%"} color={'gray.100'}
                                        bg={'blackAlpha.900'} _hover={{bg: 'gray.100', color: 'blackAlpha.900'}}>
                                    <HiUpload/> Upload file
                                </Button>
                            </FileUploadTrigger>
                            <FileUploadList clearable showSize/>
                        </FileUploadRoot>


                    </Box>
                    <Button borderRadius="xl"
                            colorScheme="purple" bg={'green.500'} color={'white'}
                            _hover={{bg: 'green.400', scale: "1.02"}} width={"100%"} border={"1px solid"}
                            borderColor={'green.500'} onClick={handleTransfer}>
                        <BiTransferAlt/>
                        Transférer
                    </Button>
                </VStack>
            ) : (
                <VStack align="stretch">
                    <Text fontSize="lg" fontWeight="bold" color="gray.700">
                        Copier le lien
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                        Copie le lien et partage le à tes amis
                    </Text>

                    <Button borderRadius="xl"
                            colorScheme="purple" bg={'green.500'} color={'white'}
                            _hover={{bg: 'green.400', scale: "1.02"}} width={"100%"} border={"1px solid"}
                            borderColor={'green.500'} onClick={copyLink}>
                        <BiTransferAlt/>
                        Copie
                    </Button>
                </VStack>
            )
            }

        </Box>
    );
};

export default FileUpload;
