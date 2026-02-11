import { createContext, useContext, useReducer, useCallback } from 'react';

const MapperContext = createContext(null);

const initialState = {
  svgContent: '',
  svgFileName: '',
  prefix: '',
  categories: [],
  // mappings: { [elementIndex]: { name, code, fullCode } }
  mappings: {},
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_SVG':
      return {
        ...state,
        svgContent: action.payload.content,
        svgFileName: action.payload.fileName,
        mappings: {},
      };
    case 'SET_PREFIX':
      return { ...state, prefix: action.payload };
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    case 'MAP_ELEMENT':
      return {
        ...state,
        mappings: {
          ...state.mappings,
          [action.payload.elementId]: action.payload.category,
        },
      };
    case 'UNMAP_ELEMENT': {
      const next = { ...state.mappings };
      delete next[action.payload];
      return { ...state, mappings: next };
    }
    case 'RESET_MAPPINGS':
      return { ...state, mappings: {} };
    default:
      return state;
  }
}

export function MapperProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setSvg = useCallback(
    (content, fileName) =>
      dispatch({ type: 'SET_SVG', payload: { content, fileName } }),
    [],
  );

  const setPrefix = useCallback(
    (prefix) => dispatch({ type: 'SET_PREFIX', payload: prefix }),
    [],
  );

  const setCategories = useCallback(
    (categories) => dispatch({ type: 'SET_CATEGORIES', payload: categories }),
    [],
  );

  const mapElement = useCallback(
    (elementId, category) =>
      dispatch({ type: 'MAP_ELEMENT', payload: { elementId, category } }),
    [],
  );

  const unmapElement = useCallback(
    (elementId) => dispatch({ type: 'UNMAP_ELEMENT', payload: elementId }),
    [],
  );

  const value = {
    ...state,
    setSvg,
    setPrefix,
    setCategories,
    mapElement,
    unmapElement,
  };

  return (
    <MapperContext.Provider value={value}>{children}</MapperContext.Provider>
  );
}

export function useMapper() {
  const ctx = useContext(MapperContext);
  if (!ctx) {
    throw new Error('useMapper must be used within a MapperProvider');
  }
  return ctx;
}
