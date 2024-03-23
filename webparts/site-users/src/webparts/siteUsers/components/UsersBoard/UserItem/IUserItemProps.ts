import { PersonaPresence } from "@fluentui/react";

export interface IUserItemProps {
    photo?:string;
    initials:string;
    presence?:PersonaPresence;
    displayName:string;
}
