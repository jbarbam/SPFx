import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'SiteUsersWebPartStrings';
import SiteUsers from './components/SiteUsers';
import { ISiteUsersProps } from './components/ISiteUsersProps';
import { SPFI } from "@pnp/sp";
import { GraphFI} from "@pnp/graph";
import { getGraph, getSP } from '../../pnpjs-config';

export interface ISiteUsersWebPartProps {
  description: string;
}

export default class SiteUsersWebPart extends BaseClientSideWebPart<ISiteUsersWebPartProps> {

  private _spFactory:SPFI;
  private _graphFactory: GraphFI;

  protected async onInit(): Promise<void> {

    await super.onInit();
    this._spFactory = getSP();
    this._graphFactory = getGraph();
  }

  public render(): void {
    const element: React.ReactElement<ISiteUsersProps> = React.createElement(
      SiteUsers,
      {
        description: this.properties.description,
        spFactory: this._spFactory,
        graphFactory: this._graphFactory
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
