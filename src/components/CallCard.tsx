import React from 'react';
import { Creator } from '../types';

interface Props {
  creator: Pick<Creator, 'id' | 'username' | 'avatar' | 'rate'>;
  onStart: () => void;
}


export default CallCard;
