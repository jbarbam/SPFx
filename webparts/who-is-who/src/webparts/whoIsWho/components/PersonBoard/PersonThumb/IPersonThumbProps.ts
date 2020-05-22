import { PersonaPresence } from "office-ui-fabric-react";

export interface IPersonThumbProps {
  photo?:string;
  initials:string;
  presence?:PersonaPresence;
  displayName:string;
  jobTitle?:string;
  department?:string;
  officeLocation?:string;
  city?:string;
}
