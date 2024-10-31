
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_Url } from "@/constants/ApiUrl";
import { Button, Group, Input, InputAddon, Stack } from "@chakra-ui/react"

export const DownloadPage: React.FC = () => {
    const { id } = useParams();
    const [files, setFiles] = useState<File[]>([]);
    const [downloaded, setDownloaded] = useState(false);
    
    
    return (
        <Stack gap="10" paddingTop={"100px"} width={"100%"}  display={'flex'}  gridGap={4}>
        <Group attached>
          <InputAddon>https://</InputAddon>
          <Input placeholder="Enter URL..." bg={"white"} color={"gray.800"} />
          <Button bg="green.400" onClick={() => setDownloaded(true)}>
            Download
          </Button>
        </Group>
      </Stack>
    );
    };