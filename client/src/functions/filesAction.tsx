

import { API_Url } from "../constants/ApiUrl";
import { toast } from "react-toastify";
const fetchFiles = async (setFiles: (value: any) => void, setLoading: (value: boolean) => void, user: any) => {
    if(!user) return;
    setLoading(true);
    try {const token = localStorage.getItem('token');
    const response = await fetch(API_Url + `/files/all/${user.id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });
    const data = await response.json();
    setFiles(data);
    setLoading(false);
    console.log(data);
    toast.success('Files fetched successfully');
}
    catch(e){
        toast.error('Error while fetching files');
        setLoading(false);
        console.log(e);
    }
}
const deleteFile = async (id: number, setFiles: (value: any) => void, setLoading: (value: boolean) => void, user: any,files: any) => {
    setLoading(true);
    try{ if(!user) return;
    const token = localStorage.getItem('token');
    const response = await fetch(API_Url + `/files/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });
    if(response.status !== 200) throw new Error('Error while deleting file');
    const data = await response.json();
    setFiles(files.filter((file: any) => file.file_id !== id));
    setLoading(false);
    console.log(data);
    toast.success('File deleted successfully');
        }
    catch(e){
        toast.error('Error while deleting file');
        setLoading(false);
        console.log(e);
    }
}

const editFile = async (id: number, name: string, setFiles: (value: any) => void, setLoading: (value: boolean) => void, user: any,file: any,files: any)=> {
    if(!user) return;
    setLoading(true);
    try{const token = localStorage.getItem('token');
    const response = await fetch(API_Url + `/files/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            metadata : { name: name, size: file.size }
        }),
    });
    const data = await response.json();
    setFiles(files.map((item: any) => {
        if (item.file_id === id) {
            return { ...item, name: name };
        }
        return item;
    }));
    setLoading(false);
    toast.success('File edited successfully');
    console.log(data);}
    catch(e){
        toast.error('Error while editing file');
        setLoading(false);
        console.log(e);
    }
}

export { fetchFiles, deleteFile, editFile };