import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
  CampaignFactory.abi,
  '0xDE2328bDae155fa20dc25954310a5969570F77a6',
);

export default instance;
