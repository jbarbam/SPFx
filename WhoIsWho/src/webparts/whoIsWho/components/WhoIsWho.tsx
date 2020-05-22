import * as React from 'react';
import styles from './WhoIsWho.module.scss';
import { IWhoIsWhoProps } from './IWhoIsWhoProps';
import { UserService } from '../../../code/services/UserService';
import PersonSeach from './PersonSearch/PersonSearch';
import { IUserInfo } from '../../../code/models/IUserInfo';
import { PersonBoard } from './PersonBoard/PersonBoard';
import { Spinner } from 'office-ui-fabric-react/lib/Spinner';
import { IWhoIsWhoState } from './IWhoIsWhoState';


export default class WhoIsWho extends React.Component<IWhoIsWhoProps, IWhoIsWhoState> {
  private _userService: UserService;
  private _interval:number;
  private _isLoading: boolean = true;
  private lastCallNumber: number = 0;

  constructor(props){
    super(props);
    this.state = { users:[] };
    this._userService = new UserService(props.graphClient);
  }

  public componentDidMount = (): void => {
    this.getUsers()
        .then(items => {
          this._isLoading = false;
          this.setState({users : items});
          this._interval = setInterval(() => this.updPresence(), 10000);
        })
        .catch((exception)=> {
          console.log(`Error retrieving users: ${exception}`);
        });
  }

  public componentWillUnmount = (): void => {
    clearInterval(this._interval);
  }

  private  getUsers = async (word?:string): Promise<Array<IUserInfo>> => {
    const defaultSizePhoto:string = "96x96";

    let users: Array<IUserInfo> = await this._userService.getUsers(word);
    users = await this._userService.getUsersPresence(users);
    users = await this._userService.getUsersPhotos(users,defaultSizePhoto);

    return users;
  }

  private updPresence = (): void => {
    if (this.state.users && this.state.users.length > 0){
      this._userService.getUsersPresence(this.state.users).then(result => {
        this.setState({users : result});
      });
    }
  }

  private loadUsers = (isNewSearch?:boolean) => {
    this.lastCallNumber++;
    const currentCallNumber = this.lastCallNumber;
    this.getUsers()
        .then(() => {
            if (!(this.lastCallNumber === currentCallNumber)) return;
            if (!isNewSearch) {
                this.setState(prevState => {
                  prevState.users.pop();
                  return { users: prevState.users };
              });
            }
        })
        .catch((exception)=> {
          console.log(`Error retrieving us: ${exception}`);
        });
  }

  private onSearch = (word:string): void => {
    this.setState({users:[]});
    this._isLoading = true;
    this.getUsers(word)
        .then(items => {
          this._isLoading = false;
          this.setState({users : items});
        })
        .catch((exception)=> {
          console.log(`Error onSearch: ${exception}`);
        });
  }

  public render(): React.ReactElement<IWhoIsWhoProps> {
    return (
      <div className={ styles.whoIsWho }>
        <div className={styles.searchBox}>
          <PersonSeach onSearch={this.onSearch}/>
        </div>
        {
         this.state.users && this.state.users.length > 0
         ?
         <PersonBoard users={this.state.users} loadNextPage={() => this.loadUsers(false)}/>
         : this._isLoading && <Spinner label="Retrieving users..." ariaLive="assertive" labelPosition="bottom" />
        }
      </div>
    );
  }
}
