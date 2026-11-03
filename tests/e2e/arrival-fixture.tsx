import React from 'react';
import { createRoot } from 'react-dom/client';
import ArrivalExperience from '../../components/arrival-experience';
import { profile } from '../../content/site';

createRoot(document.getElementById('root')!).render(
  <><ArrivalExperience profile={profile} film={null} /><div style={{ height: '100vh' }} /></>
);
