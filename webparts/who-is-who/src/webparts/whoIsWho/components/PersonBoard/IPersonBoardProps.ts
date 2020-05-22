import { IUserInfo } from "../../../../code/models/IUserInfo";

export interface IPersonBoardProps {
  users: Array<IUserInfo>;
  loadNextPage: () => void;
}
