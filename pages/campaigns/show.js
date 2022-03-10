import React from 'react';
import {
  Button,
  CardGroup,
  Grid,
  GridColumn,
  GridRow,
} from 'semantic-ui-react';
import MainLayout from '../../components/Layout';
import getCampaignInstance from '../../ethereum/campaign';
import ContributeForm from '../../components/Contribute';
import web3 from '../../ethereum/web3';
import { Link } from '../../routes';

const CampaignShow = ({
  minimumContribution,
  balance,
  numRequests,
  approversCount,
  manager,
  address,
}) => {
  const renderItems = () => {
    const items = [
      {
        header: manager,
        meta: 'Address of Manager',
        description:
          'The Manager created this campaign and can create request for payment',
        style: { overflowWrap: 'break-word' },
      },
      {
        header: minimumContribution,
        meta: 'Minimum contribution (Wei)',
        description:
          'Minimum amount in Wei required to contribute to this campaign and become approver',
      },
      {
        header: web3.utils.fromWei(balance, 'ether'),
        meta: 'Current balance (ether)',
        description: 'Amount received till date from contributors',
      },
      {
        header: numRequests,
        meta: 'Requests',
        description: 'The number of payment request from the manager',
      },
      {
        header: approversCount,
        meta: 'Contributors',
        description: 'The number of contributors to this campaign',
      },
    ];

    return <CardGroup items={items} />;
  };

  return (
    <MainLayout>
      <Grid>
        <GridRow>
          <GridColumn width={10}>{renderItems()}</GridColumn>
          <GridColumn width={6}>
            <ContributeForm address={address} />
          </GridColumn>
        </GridRow>
        <GridRow>
          <GridColumn>
            <Link route={`/campaigns/${address}/requests`}>
              <Button content='View Requests' primary />
            </Link>
          </GridColumn>
        </GridRow>
      </Grid>
    </MainLayout>
  );
};

export async function getServerSideProps(context) {
  const campaign = getCampaignInstance(context.query.address);
  const summary = await campaign.methods.getSummary().call();
  return {
    props: {
      minimumContribution: summary[0],
      balance: summary[1],
      numRequests: summary[2],
      approversCount: summary[3],
      manager: summary[4],
      address: context.query.address,
    },
  };
}

export default CampaignShow;
