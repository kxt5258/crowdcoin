import 'semantic-ui-css/semantic.min.css';
import React from 'react';
import Header from './Header';
import { Container } from 'semantic-ui-react';

const MainLayout = ({ children }) => {
  return (
    <Container>
      <Header />
      {children}
    </Container>
  );
};

export default MainLayout;
