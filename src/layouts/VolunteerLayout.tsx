import React from 'react';
import { Outlet } from 'react-router-dom';

export const VolunteerLayout: React.FC = () => {
  return (
    <>
      <Outlet />
    </>
  );
};
