import * as React from 'react';
import { Persona, PersonaSize } from '@fluentui/react/lib/Persona';
import { IUserItemProps } from './IUserItemProps';

export const UserItem: React.FunctionComponent<IUserItemProps> = (props) => {    
    return (
            <Persona
                imageUrl={props.photo}
                text={props.displayName}
                size={PersonaSize.size32}
                imageAlt={props.displayName}
                styles={{ primaryText: { fontSize: '14px' }, root: { margin: '10px' } }}
            />
        );
}