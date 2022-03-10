import React, { useState } from 'react';
import { Button, Form, FormField, Input, Message } from 'semantic-ui-react';
import MainLayout from '../../components/Layout';

import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import { Router } from '../../routes';

const CampaignNew = () => {
  const [minimumContribution, setMinimumContribution] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const createCampaign = async (event) => {
    event.preventDefault();

    try {
      setMessage('');
      setLoading(true);
      const accounts = await web3.eth.getAccounts();
      await factory.methods.createCampaign(minimumContribution).send({
        from: accounts[0],
      });
      Router.pushRoute('/');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <h3>Create a campaign</h3>
      <Form onSubmit={createCampaign} error={!!message}>
        <FormField>
          <label>Minimum Contribution </label>
          <Input
            label='Wei'
            labelPosition='right'
            placeholder='0'
            value={minimumContribution}
            onChange={(event) => setMinimumContribution(event.target.value)}
          />
        </FormField>
        <FormField>
          <Button primary type='submit' content='Create' loading={loading} />
        </FormField>

        <Message error content={message} header='Opps' />
      </Form>
    </MainLayout>
  );
};

export default CampaignNew;
