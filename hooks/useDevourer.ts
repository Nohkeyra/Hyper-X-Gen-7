import { useState, useCallback, useRef, useMemo } from 'react';

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
  | 'CRITICAL_DRIFT'

  // Error States
  | 'ERROR_TIMEOUT'
  | 'ERROR_BUFFER_EMPTY'
  | 'ERROR_INVALID_STATE';

export interface UseDevourerReturn {
  status: DevourerState;
  isProcessing: boolean;
  history: DevourerState[];
  transition: (newState: DevourerState, processing?: boolean) => void;
  revert: () => void;
  reset: () => void;
  isErrorState: boolean;
}

const ERROR_STATES: DevourerState[] = [
  'ERROR_TIMEOUT',
  'ERROR_BUFFER_EMPTY',
  'ERROR_INVALID_STATE',
  'LATTICE_FAIL',
  'CRITICAL_DRIFT'
];

const PROCESSING_STATES: DevourerState[] = [
  'DEVOURING_BUFFER',
  'AUDITING_BUFFER',
  'DETECTING_SILHOUETTE',
  'DNA_STYLIZE_ACTIVE',
  'REFINING_LATTICE'
];

export const useDevourer = (initialState: DevourerState = 'IDLE'): UseDevourerReturn => {
  const [status, setStatus] = useState<DevourerState>(initialState);
  const [isManualProcessing, setIsManualProcessing] = useState(false);
  const stateHistory = useRef<DevourerState[]>([initialState]);

  const transition = useCallback((newState: DevourerState, processing = false) => {
    stateHistory.current.push(newState);
    setStatus(newState);
    setIsManualProcessing(processing);
  }, []);

  const revert = useCallback(() => {
    if (stateHistory.current.length > 1) {
      stateHistory.current.pop();
      const previousState = stateHistory.current[stateHistory.current.length - 1];
      setStatus(previousState);
      setIsManualProcessing(false);
    }
  }, []);

  const reset = useCallback(() => {
    stateHistory.current = [initialState];
    setStatus(initialState);
    setIsManualProcessing(false);
  }, [initialState]);

  const isErrorState = useMemo(() => ERROR_STATES.includes(status), [status]);
  
  const isProcessing = useMemo(() => 
    isManualProcessing || PROCESSING_STATES.includes(status), 
    [isManualProcessing, status]
  );

  return { 
    status, 
    isProcessing,
    history: stateHistory.current,
    transition,
    revert,
    reset,
    isErrorState
  };
};
