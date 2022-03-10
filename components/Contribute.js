import React, { useState } from 'react';
import { Button, Form, FormField, Input, Message } from 'semantic-ui-react';
import getCampaignInstance from '../ethereum/campaign';
import web3 from '../ethereum/web3';
import { Router } from '../routes';

const ContributeForm = ({ address }) => {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setMessage('');

      const campaign = getCampaignInstance(address);
      const accounts = await web3.eth.getAccounts();
      await campaign.methods
        .contribute()
        .send({ value: web3.utils.toWei(amount, 'ether'), from: accounts[0] });

      setAmount(0);
      Router.replaceRoute(`/campaigns/${address}`);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form error={!!message} onSubmit={onSubmit}>
      <FormField>
        <Input
          label='ether'
          labelPosition='right'
          placeholder='Enter amout to contribute'
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
        />
      </FormField>
      <FormField>
        <Button primary content='Contribute!' loading={loading} type='submit' />
        <Message error content={message} header='Opps...' />
      </FormField>
    </Form>
  );
};

export default ContributeForm;
