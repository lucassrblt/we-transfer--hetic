import { useState, useEffect } from "react";
import { Box, Button, Editable, Icon, IconButton } from "@chakra-ui/react";
import { Card, Heading, Stack } from "@chakra-ui/react";
import { HiArchiveBox } from "react-icons/hi2";
import { GoFileZip } from "react-icons/go";
import { LuCheck, LuPencilLine, LuX } from "react-icons/lu";
import { CgCopy } from "react-icons/cg";
import { API_Url } from "@/constants/ApiUrl";

interface File {
    id: number;
    name: string;
    size: number;
    lastModified: number;
}

interface UserFilesProps {
    files: File[];
    loading: boolean;
}

export const UserFiles = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState(true);

    const onChange = (value: string, id: number) => {
       let newFiles = files.map((item) => {
            if (item.id === id) {
                return { ...item, name: value };
            }
            return item;
        });

        setFiles(newFiles);
    }

    const fetchFiles = async () => {
        const token = localStorage.getItem('token');
        const response = await fetch(API_Url + "/files/all",{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        const data = await response.json();
        setFiles(data);
    }

    useEffect(() => {
        // setFiles([
        //     {
        //         id: 1,
        //         name: "file1",
        //         size: 10000000,
        //         lastModified: 1620000000000,
        //     },
        //     {
        //         id: 2,
        //         name: "file2",
        //         size: 200000000,
        //         lastModified: 162000000000,
        //     },
        // ]);
        fetchFiles();
        setLoading(false);
    }, []);

    return (
        <Box  p={4} mb={4} alignItems="center" paddingTop={"100px"} width={"100%"}  display={'flex'}  gridGap={4}>
        {files.map((item, index) => (
            <Card.Root key={index} width="320px" p={4} mb={4} boxShadow={"md"}>
              
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
                        <Editable.SubmitTrigger asChild>
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
                    <Button bg="red.500" color="white"  onClick={() => {}}>
                        Delete
                    </Button>
                </Card.Footer>
            </Card.Root>
        
        ))}
      </Box>
    );
};