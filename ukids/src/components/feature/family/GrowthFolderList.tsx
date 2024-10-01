import { useEffect, useState } from "react";
import api from "@/util/api.ts";

interface Folder{
    folderId: number;
    folderName: string;
}

export const GrowthFolderList = () => {
    
    const [folders, setFolders] = useState<Folder[]>([]);

    const getFolderList = async () => {
        const url = `/growth-folder/all/11`;

        const {data} = await api.get(url);

        setFolders(data.result)

    }

    useEffect(() => {
        getFolderList();
    }, [])

    return (
        <div>
          
        </div>
    )
}