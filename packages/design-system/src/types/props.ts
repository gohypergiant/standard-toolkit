export type ClassNames = {
  [key: string]: string | ClassNames;
};

export type OmitProtectedProps<T extends object> = Omit<
  Partial<T>,
  'key' | 'ref' | 'id' | 'children' | 'className' | 'classNames' | 'style'
>;
