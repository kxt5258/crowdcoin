const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

const web3 = new Web3(ganache.provider());

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  factory = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: compiledFactory.evm.bytecode.object })
    .send({ from: accounts[0], gas: '2000000' });

  await factory.methods
    .createCampaign('100')
    .send({ from: accounts[0], gas: '2000000' });

  [campaignAddress] = await factory.methods.getDeployedCampaigns().call();
  campaign = await new web3.eth.Contract(compiledCampaign.abi, campaignAddress);
});

describe('Campaign Contract', () => {
  it('deployes campaign factory and a campaign', () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it('sets caller as campaign manager', async () => {
    const manager = await campaign.methods.manager().call();
    assert.equal(manager, accounts[0]);
  });

  it('allows people to contribute and marks them as approvers', async () => {
    await campaign.methods
      .contribute()
      .send({ value: '200', from: accounts[1] });

    const isContributor = await campaign.methods.approvers(accounts[1]).call();
    assert(isContributor);
  });

  it('requires a minimum contribution', async () => {
    await assert.rejects(
      campaign.methods.contribute().send({ value: '90', from: accounts[1] }),
    );
  });

  it('allows manager to make a payment request', async () => {
    await campaign.methods
      .createRequest('Buy Something', 999, accounts[2])
      .send({ from: accounts[0], gas: '1000000' });

    const request = await campaign.methods.requests(0).call();
    assert.equal(request.description, 'Buy Something');
  });

  it('processes requests', async () => {
    await campaign.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei('10', 'ether'),
    });

    await campaign.methods
      .createRequest('Books', web3.utils.toWei('2', 'ether'), accounts[5])
      .send({ from: accounts[0], gas: '1000000' });

    await campaign.methods.approveRequest(0).send({
      from: accounts[0],
      gas: '1000000',
    });

    await campaign.methods.finalizeRequest(0).send({
      from: accounts[0],
      gas: '1000000',
    });

    let balance = await web3.eth.getBalance(accounts[5]);
    balance = web3.utils.fromWei(balance, 'ether');

    balance = parseFloat(balance);
    console.log(balance);

    assert(balance > 100);
  });
});
