import * as React from 'react';
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';
import { IPersonSearchProps } from './IPersonSearchProps';

export default class PersonSearch extends React.Component<IPersonSearchProps> {

  constructor(props){
    super(props);
    this.onSearch = this.onSearch.bind(this);
  }

  private onSearch = (wordToSearch:string): void => {
    this.props.onSearch(wordToSearch);
  }

  public render(): React.ReactElement<{}> {
    return (
      <div>
        <SearchBox placeholder="Search"
                   underlined={true}
                   onSearch={newValue => this.onSearch(newValue)}
        />
        </div>
    );
  }
}
