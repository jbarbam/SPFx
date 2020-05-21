
import { Guid } from "@microsoft/sp-core-library";

export interface IPersonPresence {
  id: Guid;
  availability?: string;
  activity?: string;
}
