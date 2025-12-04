declare module '*.svg' {
  import * as React from 'react';

  // Declara que a exportação padrão do .svg é um componente React
  const content: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  export default content;
}