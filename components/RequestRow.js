import React, { useState } from 'react';
import { Button, TableCell, TableRow } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import getCampaignInstance from '../ethereum/campaign';
import { Router } from '../routes';

const RequestRow = ({ request, id, address, approversCount }) => {
  const [loading, setLoading] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const readyForFinalize = request.approvalCount > approversCount / 2;

  const onApprove = async () => {
    setLoading(true);
    try {
      const campaign = getCampaignInstance(address);
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.approveRequest(id).send({ from: accounts[0] });
      Router.replaceRoute(`/campaigns/${address}/requests`);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const onFinalize = async () => {
    setFinalizing(true);
    try {
      const campaign = getCampaignInstance(address);
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.finalizeRequest(id).send({ from: accounts[0] });
      Router.replaceRoute(`/campaigns/${address}/requests`);
    } catch (error) {
    } finally {
      setFinalizing(false);
    }
  };

  return (
    <TableRow
      disabled={request.complete}
      positive={readyForFinalize && !request.complete}>
      <TableCell>{id}</TableCell>
      <TableCell>{request.description}</TableCell>
      <TableCell>{web3.utils.fromWei(request.value, 'ether')}</TableCell>
      <TableCell>{request.recipient}</TableCell>
      <TableCell>
        {request.approvalCount} / {approversCount}
      </TableCell>
      <TableCell>
        {request.complete ? null : (
          <Button
            content='Approve'
            color='red'
            basic
            loading={loading}
            onClick={onApprove}
          />
        )}
      </TableCell>
      <TableCell>
        {request.complete || !readyForFinalize ? null : (
          <Button
            content='Finalize'
            color='teal'
            basic
            loading={finalizing}
            onClick={onFinalize}
          />
        )}
      </TableCell>
    </TableRow>
  );
};

export default RequestRow;
