import { SPFI } from "@pnp/sp";
import { GraphFI} from "@pnp/graph";
export interface ISiteUsersProps {
  description: string;
  spFactory: SPFI;
  graphFactory: GraphFI;
}
