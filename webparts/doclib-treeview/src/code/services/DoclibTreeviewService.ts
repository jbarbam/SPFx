import { SPFI } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
import "@pnp/sp/folders";

import { IResponseItem } from "../models/IResponseItem";

export class DoclibTreeviewService {

    private _spfiContext: SPFI;

    constructor(spfiContext: SPFI) {
        this._spfiContext = spfiContext;
    }
    
    public getDoclibTreeview = async(doclibName:string): Promise<Array<any>> => {
        try {
            
            
            const responseFiles: Array<unknown> = await this._spfiContext.web.lists
                    .getByTitle(doclibName)
                    .items
                    .expand("Folder","File")();
            

            const items: Array<IResponseItem> = responseFiles.map((item: any) => {
                return {
                    Id: item.Id,
                    Title: item.FileSystemObjectType === 0 ? item.File.Title : "",
                    Name: item.FileSystemObjectType === 0 ? item.File.Name : item.Folder.Name,
                    ServerRelativeUrl: item.FileSystemObjectType === 0 ? item.File.ServerRelativeUrl : item.Folder.ServerRelativeUrl,
                }
            })

            //sort items
            items.sort((a,b) => (a.ServerRelativeUrl.localeCompare(b.ServerRelativeUrl)));

            return items
        }
        catch(ex)
        {
            console.log(`Fail getSiteUsers: ${ex}`);
            throw(ex)
        }
    }
}