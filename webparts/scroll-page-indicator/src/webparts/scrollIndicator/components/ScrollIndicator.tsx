import * as React from 'react';
import styles from './ScrollIndicator.module.scss';
import { IScrollIndicatorProps } from './IScrollIndicatorProps';
import { IScrollIndicatorState } from './IScrollIndicatorState';

export default class ScrollIndicator extends React.Component<IScrollIndicatorProps, IScrollIndicatorState> {

  private scrollElement:string = "scrollRegion_5c383ccf auto_5c383ccf";

  constructor(props){
    super(props);
    this.state = { scrolledPercentage: 0 };
  }

  public componentDidMount = (): void => {
    //window.addEventListener("scroll", this.calculateScrolledInPercentage);
    //this.props.context.domElement.addEventListener("scroll", this.calculateScrolledInPercentage);
    document.getElementsByClassName(this.scrollElement)[0].addEventListener("scroll", this.calculateScrolledInPercentage);
  }

  public componentWillUnmount = ():void => {
    //window.removeEventListener("scroll", this.calculateScrolledInPercentage);
    //this.props.context.domElement.removeEventListener("scroll", this.calculateScrolledInPercentage);
    document.getElementsByClassName(this.scrollElement)[0].removeEventListener("scroll", this.calculateScrolledInPercentage);
  }

  private calculateScrolledInPercentage = (event) => {

    //const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const winScroll = document.getElementsByClassName(this.scrollElement)[0].scrollTop;

    //const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const height = document.getElementsByClassName(this.scrollElement)[0].scrollHeight -
                   document.getElementsByClassName(this.scrollElement)[0].clientHeight;


    const scrolledPercentage = (winScroll / height) * 100;

    this.setState({
      scrolledPercentage
    });
  }

  public render(): React.ReactElement<IScrollIndicatorProps> {
    const scrolledPercentage:number = this.state.scrolledPercentage;

    return (
     <div className={styles.scrollIndicator}>
        <div className={styles.progressContainer}>
          <div
            className={styles.progressBar}
            style={{ width: `${scrolledPercentage}%` }}
          ></div>
        </div>
      </div>
    );
  }
}
