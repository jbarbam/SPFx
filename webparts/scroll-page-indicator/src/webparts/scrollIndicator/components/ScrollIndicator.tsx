import * as React from 'react';
import styles from './ScrollIndicator.module.scss';
import { IScrollIndicatorProps } from './IScrollIndicatorProps';
import { IScrollIndicatorState } from './IScrollIndicatorState';
import {
  Environment,
  EnvironmentType
} from '@microsoft/sp-core-library';

const DATA_IS_SCROLLABLE_ATTRIBUTE:string = 'data-is-scrollable';
const SCROLL_EVENT_LISTENER:string = "scroll";

export default class ScrollIndicator extends React.Component<IScrollIndicatorProps, IScrollIndicatorState> {

  private scrollDiv: Element = null;

  constructor(props){
    super(props);
    this.state = { scrolledPercentage: 0};
  }

  public componentDidMount = (): void => {
    this.scrollDiv = this.findScrollableParent();
    this.scrollDiv.addEventListener(SCROLL_EVENT_LISTENER, this.calculateScrolledInPercentage);
  }

  public componentWillUnmount = ():void => {
    this.scrollDiv.removeEventListener(SCROLL_EVENT_LISTENER, this.calculateScrolledInPercentage);
  }

  private calculateScrolledInPercentage = () => {

    const winScroll = this.scrollDiv.scrollTop;

    const height = this.scrollDiv.scrollHeight -
                   this.scrollDiv.clientHeight;

    const scrolledPercentage = (winScroll / height) * 100;

    this.setState({
      scrolledPercentage
    });
  }


  private findScrollableParent = (): Element => {

    const divs = document.querySelectorAll('div');
    let _div: Element = null;

    divs.forEach(div => {
      if (!_div && div.getAttribute(DATA_IS_SCROLLABLE_ATTRIBUTE) === 'true'){
        _div = div;
      }
    });

    if (!_div){
      divs.forEach(div => {
        const computedStyles = getComputedStyle(div);
        let overflowY = computedStyles ? computedStyles.getPropertyValue('overflow-y') : '';
        if (overflowY && (overflowY === 'scroll' || overflowY === 'auto')) {
          _div = div;
        }
      });
    }

    return _div;
  }

  private isWorkbenchPage = (): boolean => {
    return ((Environment.type === EnvironmentType.Local) || (this.props.context.pageContext.site.serverRequestPath.toString().indexOf("workbench") !== -1));
  }

  public render(): React.ReactElement<IScrollIndicatorProps> {
    const scrolledPercentage:number = this.state.scrolledPercentage;

    return (
     <div className={this.isWorkbenchPage() ?
                     styles.scrollIndicator_localenv :
                     styles.scrollIndicator_shareenv }>
        <div className={styles.progressContainer}>
          <div
            className={styles.progressBar}
            style={{ width: `${scrolledPercentage}%` }}
          >

          </div>
        </div>
      </div>
    );
  }
}
