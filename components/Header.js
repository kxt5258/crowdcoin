import React from 'react';
import { Menu, MenuItem, MenuMenu } from 'semantic-ui-react';
import { Link } from '../routes';

const Header = () => {
  return (
    <Menu style={{ marginTop: '10px' }}>
      <Link route='/'>
        <a className='item'>CrowdCoin</a>
      </Link>
      <MenuMenu position='right'>
        <Link route='/'>
          <a className='item'>Campaigns</a>
        </Link>
        <Link route='/campaigns/new'>
          <a className='item'>+</a>
        </Link>
      </MenuMenu>
    </Menu>
  );
};

export default Header;
