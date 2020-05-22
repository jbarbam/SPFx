import * as React from 'react';
import { FocusZone } from 'office-ui-fabric-react/lib/FocusZone';
import { List } from 'office-ui-fabric-react/lib/List';
import { IRectangle } from 'office-ui-fabric-react/lib/Utilities';
import { PersonThumb } from './PersonThumb/PersonThumb';
import styles from './PersonBoard.module.scss';
import { IPersonBoardProps } from './IPersonBoardProps';
import { IUserInfo } from '../../../../code/models/IUserInfo';
import { Spinner } from 'office-ui-fabric-react';

const ROWS_PER_PAGE = 2;
const MAX_ROW_HEIGHT = 100;

export class PersonBoard extends React.Component<IPersonBoardProps> {
  private _columnCount: number;
  private _columnWidth: number;
  private _rowHeight: number;

  constructor(props: IPersonBoardProps) {
    super(props);
  }

  public render(): JSX.Element {
    return (
      <FocusZone>
          <List
            className={styles.personBoard}
            items={this.props.users.concat([])}
            getItemCountForPage={this.getItemCountForPage}
            getPageHeight={this.getPageHeight}
            onRenderCell={this.onRenderCell}
            renderedWindowsAhead={2}
            renderedWindowsBehind={2}
          />
      </FocusZone>
    );
  }

  private getItemCountForPage = (itemIndex: number, surfaceRect: IRectangle): number => {
    if (itemIndex === 0) {
      this._columnCount = Math.ceil(surfaceRect.width / MAX_ROW_HEIGHT);
      this._columnWidth = Math.floor(surfaceRect.width / this._columnCount);
      this._rowHeight = this._columnWidth;
    }

    return this._columnCount * ROWS_PER_PAGE;
  }

  private getPageHeight = (): number => {
    return this._rowHeight * ROWS_PER_PAGE;
  }

  private onRenderCell = (user: IUserInfo, index: number): JSX.Element => {
    if (!user) {
      this.props.loadNextPage();
      return <Spinner className="spinner" />;
    }
    return (
      <div className={styles.personBoardTile} data-is-focusable={true}>
        <div className={styles.personBoardSizer}>
          <div className={styles.personBoardPadder}>
            <PersonThumb {...user} />
          </div>
        </div>
      </div>
    );
  }
}
