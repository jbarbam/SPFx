import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'ScrollIndicatorWebPartStrings';
import ScrollIndicator from './components/ScrollIndicator';
import { IScrollIndicatorProps } from './components/IScrollIndicatorProps';
import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface IScrollIndicatorWebPartProps {
  description: string;
}

export default class ScrollIndicatorWebPart extends BaseClientSideWebPart <IScrollIndicatorWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IScrollIndicatorProps> = React.createElement(
      ScrollIndicator,
      {
        description: this.properties.description,
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

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
