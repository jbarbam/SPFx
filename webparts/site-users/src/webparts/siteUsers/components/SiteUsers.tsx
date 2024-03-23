import * as React from 'react';
import styles from './SiteUsers.module.scss';
import type { ISiteUsersProps } from './ISiteUsersProps';
import { escape } from '@microsoft/sp-lodash-subset';

export default class SiteUsers extends React.Component<ISiteUsersProps, {}> {
  public render(): React.ReactElement<ISiteUsersProps> {
    const {
      description,
    } = this.props;

    return (
      <section>
        <div className={styles.welcome}>
          <div>Web part property value: <strong>{escape(description)}</strong></div>
        </div>
      </section>
    );
  }
}
