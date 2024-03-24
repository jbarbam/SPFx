import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'DoclibTreeviewWebPartStrings';
import DoclibTreeview from './components/DoclibTreeview';
import { IDoclibTreeviewProps } from './components/IDoclibTreeviewProps';

import { getSP } from  '../../pnpjs-config'


export interface IDoclibTreeviewWebPartProps {
  doclibName: string;
}

export default class DoclibTreeviewWebPart extends BaseClientSideWebPart<IDoclibTreeviewWebPartProps> {

  protected async onInit(): Promise<void> {
   
    await super.onInit();

    //Initialize our _sp object that we can then use in other packages without having to pass around the context.
    //  Check out pnpjsConfig.ts for an example of a project setup file.
    getSP(this.context);
  }
  
  
  public render(): void {
    const element: React.ReactElement<IDoclibTreeviewProps> = React.createElement(
      DoclibTreeview,
      {
        doclibName: this.properties.doclibName,
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
            description: strings.PropertyPaneDoclib
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('doclibName', {
                  label: strings.DoclibFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
