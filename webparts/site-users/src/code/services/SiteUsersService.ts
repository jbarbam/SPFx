import { SPFI } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
import { ISiteUsers } from "@pnp/sp/site-users/types";

export class SiteUsersService {

    private _spfiContext: SPFI;

    constructor(spfiContext: SPFI) {
        this._spfiContext = spfiContext;
    }
    
    public getSiteUsers = async(): Promise<Array<ISiteUsers>> => {
        try {
            const users:Array<ISiteUsers> = await this._spfiContext.web.siteUsers();
            return users;
        }
        catch(ex)
        {
            console.log(`Fail getSiteUsers: ${ex}`);
            throw(ex)
        }
    }
}