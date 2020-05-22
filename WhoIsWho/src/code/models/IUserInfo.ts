import { PersonaPresence } from "office-ui-fabric-react/lib/Persona";

export interface IUserInfo {
  id: string;
  userPrincipalName: string;
  givenName: string;
  surname: string;
  displayName: string;
  jobTitle:string;
  department?:string;
  officeLocation?:string;
  city?:string;
  country?:string;
  mobilePhone?:string;
  businessPhones?:string[];
  photo:string;
  presence?:PersonaPresence;
  initials:string;
}
