import React from 'react';
import {
  Button,
  Table,
  TableBody,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from 'semantic-ui-react';
import MainLayout from '../../../components/Layout';
import { Link } from '../../../routes';
import getCampaignInstance from '../../../ethereum/campaign';
import RequestRow from '../../../components/RequestRow';

const index = ({ address, requests, approversCount, numRequests }) => {
  const renderRow = () => {
    return JSON.parse(requests).map((request, index) => {
      return (
        <RequestRow
          request={request}
          key={index}
          address={address}
          id={index}
          approversCount={approversCount}
        />
      );
    });
  };

  return (
    <MainLayout>
      <h3>Request list</h3>
      <Link route={`/campaigns/${address}/requests/new`}>
        <Button
          content='Add Request'
          primary
          floated='right'
          style={{ marginBottom: '10px' }}
        />
      </Link>

      <Table celled>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Id</TableHeaderCell>
            <TableHeaderCell>Description</TableHeaderCell>
            <TableHeaderCell>Amount</TableHeaderCell>
            <TableHeaderCell>Recipient</TableHeaderCell>
            <TableHeaderCell>Approval Count</TableHeaderCell>
            <TableHeaderCell>Approve</TableHeaderCell>
            <TableHeaderCell>Finalize</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>{renderRow()}</TableBody>
      </Table>

      <div>Found {numRequests} requests</div>
    </MainLayout>
  );
};

export async function getServerSideProps(context) {
  const address = context.query.address;
  const campaign = getCampaignInstance(address);
  const numRequests = await campaign.methods.getRequestCount().call();
  const approversCount = await campaign.methods.approversCount().call();

  const requests = await Promise.all(
    Array(parseInt(numRequests))
      .fill()
      .map((_, index) => {
        return campaign.methods.requests(index).call();
      }),
  );

  return {
    props: {
      address,
      numRequests,
      requests: JSON.stringify(requests),
      approversCount,
    },
  };
}

export default index;
