import React from 'react';
import { Outlet } from 'react-router-dom';

export const CoordinatorLayout: React.FC = () => {
  return (
    <>
      <Outlet />
    </>
  );
};
