import { MSGraphClient} from '@microsoft/sp-http';
import { IPersonPresence } from '../models/IPersonPresence';
import * as Utils from '../Utils';
import { IUserInfo } from '../models/IUserInfo';
import { PersonaPresence } from "office-ui-fabric-react/lib/Persona";

const _: any = require('lodash');

export class UserService {

  private _graphClient: MSGraphClient;

  constructor(graphClient: MSGraphClient) {
    this._graphClient = graphClient;
  }

  private getUsersRecursive = async(nextLink:string, users:Array<IUserInfo>):Promise<string> => {
    try {
      const result = await this._graphClient
                                   .api(nextLink)
                                   .get();

       result.value.map(user => {
            const userInfo:IUserInfo = {...user};
            userInfo.initials = this.getUserInitials(userInfo);
            users.push(userInfo);
       });

      nextLink = result["@odata.nextLink"];
      return Promise.resolve(nextLink);
    }
    catch (ex) {
      console.log(`Fail getUsersRecursive: ${ex}`);
      return "";
    }
  }

  private buildUsersFilter = (word?: string): string => {
    return word ? `startswith(displayName,'${word}') or startswith(givenName,'${word}') or startswith(surname,'${word}') or startswith(userPrincipalName,'${word}') or startswith(jobTitle,'${word}') or startswith(city,'${word}')`
                 : "";
  }

  private sortUsers = (unsortUsers:Array<IUserInfo>): Array<IUserInfo> =>{

      return _.orderBy(unsortUsers, 'displayName', 'asc');

  }

  public getUsers = async (word?:string): Promise<Array<IUserInfo>> => {
    try {

        const filter:string = this.buildUsersFilter(word);

        const result:any = await this._graphClient
                                    .api(`users`)
                                    .version(`v1.0`)
                                    .select(`id,displayName,givenName,surname,userPrincipalName,jobtitle,department,officeLocation,city,country,businessPhones,mobilePhone`)
                                    .filter(filter)
                                    .get();


          let users: Array<IUserInfo> = [];

          result.value.map(user => {
            const userInfo:IUserInfo = {...user};
            userInfo.initials = this.getUserInitials(userInfo);
            users.push(userInfo);
          });

          let nextLink:string = result["@odata.nextLink"];
          while (nextLink) {
            nextLink = await this.getUsersRecursive(nextLink,users);
          }

          users = this.sortUsers(users); //sorting users by lodash because Graph call $filter caused an error with $orderby

          return users;
    }
    catch (ex) {
      console.log(`Fail getUsers: ${ex}`);
    }
  }

  public getUserPhoto = async (userId: string, photoSize:string): Promise<string> => {
    try {
      const photoBlob = await this._graphClient
                                  .api(`users/${userId}/photos/${photoSize}/$value`)
                                  .version(`v1.0`)
                                  .responseType('blob')
                                  .get();
      let photo64:string = "";

      if (photoBlob) {
        photo64 = await Utils.convertUserPhotoBlobToBase64(photoBlob);
      }

      return Promise.resolve(photo64);
    }
    catch (ex) {
      return Promise.resolve("");
    }
  }

  public getUsersPhotos = async (users: Array<IUserInfo>, photoSize:string): Promise<Array<IUserInfo>> => {
    try {

      await Promise.all(users.map(async user => {
          user.photo = await this.getUserPhoto(user.id,photoSize);
      }));

      return users;
    }
    catch (ex) {
      console.log(`Fail getUsersPhotos: ${ex}`);
    }
  }

  public getUserInitials = (user:IUserInfo):string => {

    let userInitials:string = "";
    if(user.givenName){
      userInitials = user.givenName.charAt(0).toUpperCase();
      if (user.surname){
        userInitials += user.surname.charAt(0).toUpperCase();
      }
      else {
        userInitials += user.givenName.charAt(1).toUpperCase();

      }
    }
    else{
      if (user.surname){
        userInitials += user.surname.substring(0,2).toUpperCase();
      }
    }


    return userInitials;
  }

  public getUsersPresence = async(users:Array<IUserInfo>): Promise<Array<IUserInfo>> =>{
    try {

       const usersIds:Array<string> = users.map(user => user.id);

       const repeat = Math.floor(usersIds.length/100);

        for (let idx:number=0; idx<=repeat; idx++) {
          //graph api call `communications/getPresencesByUserId` only allows call of 100 ids
          const tempUserIds:string[] = _.slice(usersIds,idx * 100,(idx * 100) + 100);
          const result:any = await this._graphClient
                                         .api(`communications/getPresencesByUserId`)
                                         .version(`beta`)
                                         .post({
                                            "ids" : tempUserIds
                                         });

            result.value.map((user: { id: any; availability: any; activity: any; }) => {
                const person:IPersonPresence = {
                  id:user.id, availability:user.availability, activity: user.activity
                };

                const presence:PersonaPresence = Utils.fromPresenceAvailabilityToPersonaPresence(person.availability);
                const userIndex:number = _.findIndex(users,{'id':person.id});
                users[userIndex].presence = presence;
            });
        }

      return users;
    }
    catch (ex) {
      console.log(`Fail getUsersPresence: ${ex}`);
    }
  }
}
