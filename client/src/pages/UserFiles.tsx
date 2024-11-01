import { useState, useEffect } from "react";
import { Box, Button, Editable, IconButton, Spinner } from "@chakra-ui/react";
import { Card,  } from "@chakra-ui/react";
import { GoFileZip } from "react-icons/go";
import { LuCheck, LuPencilLine, LuX } from "react-icons/lu";
import { CgCopy } from "react-icons/cg";
import { useAuth } from "@/context/AuthContext";
import { deleteFile, editFile, fetchFiles } from "@/functions/filesAction";
interface File {
    id: number;
    name: string;
    size: number;
    lastModified: number;
}



export const UserFiles = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const { user } = useAuth();
    const onChange = (value: string, id: number) => {
       let newFiles = files.map((item) => {
            if (item.id === id) {
                return { ...item, name: value };
            }
            return item;
        });

        setFiles(newFiles);
    }


    useEffect(() => {
        fetchFiles(setFiles, setLoading, user);
        setLoading(false);
    }, []);

    return (
     !loading ?
           <Box  p={4} mb={4} alignItems="center" paddingTop={"100px"} width={"100%"}  display={'flex'}  gridGap={4}>
        {files.map((item :any, index) => (
            <Card.Root key={index} width="420px" p={4} mb={4} boxShadow={"md"}>
              
                <Card.Body>
                <GoFileZip size={"60px"} color={"gray.500"} />
                <Editable.Root defaultValue={item.name} fontSize="lg" value={item.name} onValueChange={(e) => onChange(e.value, item.id)}>
                    <Editable.Preview />
                    <Editable.Input />
                    <Editable.Control>
                        <Editable.EditTrigger asChild>
                        <IconButton variant="ghost" size="xs">
                            <LuPencilLine />
                        </IconButton>
                        </Editable.EditTrigger>
                        <Editable.CancelTrigger asChild>
                        <IconButton variant="outline" size="xs">
                            <LuX />
                        </IconButton>
                        </Editable.CancelTrigger>
                        <Editable.SubmitTrigger asChild onClick={() => editFile(item.file_id, item.name,setFiles, setLoading, user,item,files)}>
                        <IconButton variant="outline" size="xs">
                            <LuCheck />
                        </IconButton>
                        </Editable.SubmitTrigger>
                    </Editable.Control>
                    </Editable.Root>
                </Card.Body>
                <Card.Footer justifyContent="flex-end">
                    <Button variant="outline">
                        Share <CgCopy/>
                    </Button>
                    <Button bg="red.500" color="white"  onClick={() => deleteFile(item.file_id, setFiles,setDeleteLoading, user,files)}>
                        {deleteLoading ? <Spinner size="xs" color="white" /> : "Delete"}
                    </Button>
                </Card.Footer>
            </Card.Root>
        
        ))}
      </Box> : <Spinner color="green.400" size="xl"/>
    );
};