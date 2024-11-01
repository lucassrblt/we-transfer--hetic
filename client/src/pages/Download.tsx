
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {Button, Group, Input, InputAddon, Stack} from "@chakra-ui/react"
import { Text } from "@chakra-ui/react";
import {downloadFile} from "@/functions/files.ts";
import {toaster, Toaster} from "@/components/ui/toaster";

export const DownloadPage: React.FC = () => {
    const {token} = useParams();
    const [files, setFiles] = useState<File[]>([]);
    const [downloaded, setDownloaded] = useState(false);
    const [filePath, setFilePath] = useState("");


    const handleDownload = async () => {
        const response = await downloadFile(token);
        if(response.status === "SUCCESS"){
            setDownloaded(true)
            toaster.create({title: "File downloaded", description: "Your file has been downloaded successfully, you will be redirected"});
            setTimeout(() => {
                window.location.href = "/";
            }, 3000)
        }else{
            toaster.create({title: "Error when downloading file", description: "Something went wrong with the download"});
        }
    }

    useEffect(() => {
        handleDownload()
    }, [token]);


    return (
        token ? (
            <>
                <Toaster/>
            </>
        ) : (
            <Stack gap="10" paddingTop="100px" width="100%" display="flex" gridGap={4}>
                <Group attached>
                    <InputAddon>https://</InputAddon>
                    <Input placeholder="Enter URL..." bg="white" color="gray.800"/>
                    <Button bg="green.400" onClick={() => setDownloaded(true)}>
                        Download
                    </Button>
                </Group>
            </Stack>
        )
    );
};