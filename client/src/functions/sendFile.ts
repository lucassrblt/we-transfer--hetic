import {API_Url} from "@/constants/ApiUrl.tsx";

export default async function sendFile(mailObject, file){
    try {
        const formData = new FormData()
        formData.append('mailData', JSON.stringify(mailObject));
        formData.append('file', file);
        formData.append('metadata', JSON.stringify({ name: file.name, size: file.size }));
        formData.append('filedata', JSON.stringify({ userId: "testtt"}))

        const response = await fetch(API_Url + "/files/upload", {
            method: "POST",
            body: formData
        })

        if(!response.ok){
            throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

        return await response.json()

    }catch(e){
        console.error("Erreur lors de l'envoi du fichier :", e);
        throw e;
    }

}