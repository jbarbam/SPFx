import { PersonaPresence } from "office-ui-fabric-react/lib/Persona";

  export function fromPresenceAvailabilityToPersonaPresence(activity: string): PersonaPresence {
    switch (activity) {
      case 'Busy':
      case 'BusyIdle':
        return PersonaPresence.busy;
      case 'Available':
      case 'AvailableIdle':
        return PersonaPresence.online;
      case 'Away':
      case 'BeRightBack':
        return PersonaPresence.away;
      case 'Offline':
        return PersonaPresence.offline;
      case 'DoNotDisturb':
        return PersonaPresence.dnd;
      default:
        return PersonaPresence.offline;
    }
  }

export function convertUserPhotoBlobToBase64(response: any): Promise<string> {
    return new Promise<string>(resolve => {
      const reader:FileReader = new FileReader();
      reader.readAsDataURL(response);
      reader.onloadend = () => {
        let result:string = reader.result.toString();
        resolve(result);
      };
    });
  }
