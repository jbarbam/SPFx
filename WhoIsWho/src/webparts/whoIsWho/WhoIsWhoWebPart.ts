import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'WhoIsWhoWebPartStrings';
import WhoIsWho from './components/WhoIsWho';
import { IWhoIsWhoProps } from './components/IWhoIsWhoProps';
import { MSGraphClient } from '@microsoft/sp-http';

export interface IWhoIsWhoWebPartProps {
  description: string;
}

export default class WhoIsWhoWebPart extends BaseClientSideWebPart <IWhoIsWhoWebPartProps> {

  private _graphClient: MSGraphClient;

  public onInit(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.context.msGraphClientFactory.getClient().then(client => {
        this._graphClient = client;
        resolve();
      }).catch(error => {
        console.log(error);
        reject(error);
      });
    });
  }

  public render(): void {
    const element: React.ReactElement<IWhoIsWhoProps> = React.createElement(
      WhoIsWho,
      {
        graphClient: this._graphClient,
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
