import { SPFI } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
import "@pnp/sp/folders";

import { ITreeItem } from "@pnp/spfx-controls-react/lib/TreeView";

export class DoclibTreeviewService {

    private _spfiContext: SPFI;

    constructor(spfiContext: SPFI) {
        this._spfiContext = spfiContext;
    }
    
    public getDoclibTreeview = async(doclibName:string): Promise<Array<ITreeItem>> => {
        try {
            
            
            const response: Array<any> = await this._spfiContext.web.lists
                    .getByTitle(doclibName)
                    .items
                    .expand("Folder","File")();
            

            const items: Array<ITreeItem> = response.map((item:any) => {
                return {
                    key: item.Id,
                    label: item.FileSystemObjectType === 0 ? item.File.Name : item.Folder.Name,
                    sublabel: item.FileSystemObjectType === 0 ? item.File.Title : "",
                    data: item.FileSystemObjectType === 0 ? item.File.ServerRelativeUrl : item.Folder.ServerRelativeUrl,
                    children:[]
                }
            })

            const prefixmap:any = new Map();
            const treeview:Array<ITreeItem> = [];
            for (const node of items) {
                node.children = [];
                const nodeUrl:string = node.data;
                const lastslash:number = nodeUrl.lastIndexOf('/');
                const prefix:string = nodeUrl.substring(0,lastslash);

                if(prefixmap.has(prefix)) {                // has parent, so add to that one
                    prefixmap.get(prefix).children.push(node)
                 } else {                                   // toplevel node
                    treeview.push(node);
                 }
                 
                 prefixmap.set(nodeUrl,node);                // store as potential parent in any case
        
            }

            return treeview;
        }
        catch(ex)
        {
            console.log(`DoclibTreeviewService.getDoclibTreeview: ${ex}`);
            throw(ex)
        }
    }
}