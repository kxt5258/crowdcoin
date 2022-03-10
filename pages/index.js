import React, { useEffect } from 'react';
import { Button, CardGroup } from 'semantic-ui-react';

import factory from '../ethereum/factory';
import MainLayout from '../components/Layout';
import { Link } from '../routes';

const Index = ({ campaigns }) => {
  const renderCampaigns = () => {
    const items = campaigns.map((address) => {
      return {
        header: address,
        description: (
          <Link route={`/campaigns/${address}`}>
            <a>View Campaigns</a>
          </Link>
        ),
        fluid: true,
      };
    });

    return <CardGroup items={items} />;
  };

  return (
    <MainLayout>
      <div>
        <h3>Open Campaigns</h3>
        <Link route='/campaigns/new'>
          <a className='item'>
            <Button
              content='Create Campaign'
              icon='add circle'
              primary
              labelPosition='left'
              floated='right'
            />
          </a>
        </Link>
        {renderCampaigns()}
      </div>
    </MainLayout>
  );
};

export const getServerSideProps = async () => {
  const campaigns = await factory.methods.getDeployedCampaigns().call();
  return { props: { campaigns } };
};

export default Index;
