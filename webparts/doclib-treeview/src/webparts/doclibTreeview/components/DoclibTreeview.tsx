import * as React from 'react';
import styles from './DoclibTreeview.module.scss';
import { escape } from '@microsoft/sp-lodash-subset';
import { getSP } from  '../../../pnpjs-config';
import { Logger, LogLevel } from "@pnp/logging";
import { SPFI } from "@pnp/sp";
import { TreeView, ITreeItem, TreeViewSelectionMode } from "@pnp/spfx-controls-react/lib/TreeView";

import type { IDoclibTreeviewProps } from './IDoclibTreeviewProps';
import { IDoclibTreeviewState } from './IDoclibTreeviewState';
import { DoclibTreeviewService } from '../../../code/services/DoclibTreeviewService';


export default class DoclibTreeview extends React.Component<IDoclibTreeviewProps, IDoclibTreeviewState> {
  private _sp: SPFI;
  private LOG_SOURCE = "Document Library Treeview";
  private _service: DoclibTreeviewService;
  
  
  constructor(props:IDoclibTreeviewProps ) {
    super(props);
    this.state = {
      doclibtreeview:[]
    }
    this._sp = getSP()
    this._service = new DoclibTreeviewService(this._sp);
  }

  public componentDidMount(): void {
      this.getDoclibTreeview().then()
          .catch(err => console.log(`${this.LOG_SOURCE} (getDoclibTreeview) - ${JSON.stringify(err)} - `, LogLevel.Error));
  }
 
  public render(): React.ReactElement<IDoclibTreeviewProps> {
    const {
      doclibName
    } = this.props;

    return (
      <section>
        <div className={styles.welcome}>
          <div>Document library name: <strong>{escape(doclibName)}</strong></div>
          <TreeView 
              items={this.state.doclibtreeview}
              defaultExpanded={true}
              selectionMode={TreeViewSelectionMode.Single}
              showCheckboxes={false}
           />
        </div>
      </section>
    )
  }

  private getDoclibTreeview = async(): Promise<void> => {

    try{
      const doclibtreeview: Array<ITreeItem> = await this._service.getDoclibTreeview(this.props.doclibName);
       // Add the items to the state
       this.setState({ doclibtreeview });

    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (getDoclibTreeview) - ${JSON.stringify(err)} - `, LogLevel.Error);
    }

  }
}
