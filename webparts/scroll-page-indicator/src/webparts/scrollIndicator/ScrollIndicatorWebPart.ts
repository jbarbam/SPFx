import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import ScrollIndicator from './components/ScrollIndicator';
import { IScrollIndicatorProps } from './components/IScrollIndicatorProps';

export default class ScrollIndicatorWebPart extends BaseClientSideWebPart <{}> {

  public render(): void {
    const element: React.ReactElement<IScrollIndicatorProps> = React.createElement(
      ScrollIndicator,
      {
        context: this.context
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
}
