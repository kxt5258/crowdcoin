import React, { useState } from 'react';
import { Button, Form, FormField, Input, Message } from 'semantic-ui-react';
import MainLayout from '../../../components/Layout';
import getCampaignInstance from '../../../ethereum/campaign';
import web3 from '../../../ethereum/web3';
import { Link, Router } from '../../../routes';

const New = ({ address }) => {
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const [recipient, setRecipient] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const onSubmit = async (event) => {
    event.preventDefault();
    const campaign = getCampaignInstance(address);

    try {
      setLoading(true);
      setMessage('');
      const accounts = await web3.eth.getAccounts();
      await campaign.methods
        .createRequest(description, web3.utils.toWei(value, 'ether'), recipient)
        .send({ from: accounts[0] });

      Router.pushRoute(`/campaigns/${address}/requests`);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <h3>Create a Payment Requests</h3>
      <Form error={!!message} onSubmit={onSubmit}>
        <FormField>
          <Input
            placeholder='Description'
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </FormField>
        <FormField>
          <Input
            placeholder='Value in ether'
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
        </FormField>
        <FormField>
          <Input
            placeholder='Recipient Address'
            value={recipient}
            onChange={(event) => setRecipient(event.target.value)}
          />
        </FormField>
        <FormField>
          <Button primary content='Create Request' loading={loading} />
          <Link route={`/campaigns/${address}/requests`}>
            <Button info content='Back' icon='arrow circle left' />
          </Link>

          <Message error header='Opps...' content={message} />
        </FormField>
      </Form>
    </MainLayout>
  );
};

export async function getServerSideProps(context) {
  const address = context.query.address;
  return {
    props: {
      address,
    },
  };
}

export default New;
