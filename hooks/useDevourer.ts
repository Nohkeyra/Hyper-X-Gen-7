import { useState, useCallback, useRef } from 'react';

export type DevourerState = 
  // General States
  | 'IDLE' 
  | 'STARVING' 
  | 'BUFFER_LOADED' 

  // Processing States
  | 'DEVOURING_BUFFER' 
  | 'AUDITING_BUFFER'
  | 'DETECTING_SILHOUETTE'

  // DNA-related States
  | 'DNA_LINKED' 
  | 'DNA_STYLIZE_ACTIVE'
  | 'DNA_HARVESTED' 
  | 'DNA_RESTORED'

  // Synthesis States
  | 'LATTICE_ACTIVE' 
  | 'LATTICE_FAIL'
  | 'REFINING_LATTICE'
  | 'CRITICAL_DRIFT';

export const useDevourer = (initialState: DevourerState = 'IDLE') => {
  const [status, setStatus] = useState<DevourerState>(initialState);
  const [isProcessing, setIsProcessing] = useState(false);
  const lastState = useRef<DevourerState>(initialState);

  const transition = useCallback((newState: DevourerState, processing = false) => {
    lastState.current = status;
    setStatus(newState);
    setIsProcessing(processing);
  }, [status]);

  const revert = useCallback(() => {
    setStatus(lastState.current);
    setIsProcessing(false);
  }, []);

  return { 
    status, 
    isProcessing, 
    transition,
    revert
  };
};
