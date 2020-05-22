import * as React from 'react';
import {
  IPersonaProps,
  Persona,
  PersonaSize,
  IPersonaSharedProps,
} from 'office-ui-fabric-react/lib/Persona';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { IPersonThumbProps } from './IPersonThumbProps';
import styles from './PersonThumb.module.scss';

export const PersonThumb: React.FunctionComponent<IPersonThumbProps> = (props) => {

  const persona: IPersonaSharedProps = {
    imageUrl:props.photo,
    imageInitials:props.initials,
    presence:props.presence,
    size:PersonaSize.size100,
    text:props.displayName,
    secondaryText:props.jobTitle,
    tertiaryText:props.department,
    optionalText:props.officeLocation && props.city && `${props.officeLocation} (${props.city})`
  };


  function _onRenderSecondaryText(personaProps: IPersonaProps): JSX.Element {
    return (
      <div>
        <Icon iconName="Suitcase" className={styles.icon} />
        {personaProps.secondaryText}
      </div>
    );
  }

  function _onRenderTertiaryText(personaProps: IPersonaProps): JSX.Element {
    return (
      <div>
        <Icon iconName="People" className={styles.icon} />
        {personaProps.tertiaryText}
      </div>
    );
  }

  function _onRenderOptionalText(personaProps: IPersonaProps): JSX.Element {
    return (
      <div>
        <Icon iconName="MapPin" className={styles.icon} />
        {personaProps.optionalText}
      </div>
    );
  }

  return (
      <div className={styles.personThumb}>
          <Persona
            {...persona}
            onRenderSecondaryText={_onRenderSecondaryText}
            onRenderTertiaryText={_onRenderTertiaryText}
            onRenderOptionalText={_onRenderOptionalText}
          />
      </div>
  );
};
