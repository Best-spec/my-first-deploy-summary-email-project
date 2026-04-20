import { useState } from 'react';

export const useUpdateTitle = () => {
  const [title, setTitle] = useState('Analyze Data');

  const updateTitle = (newTitle: string) => {
    setTitle(newTitle);
  };

  return { title, updateTitle };
};
