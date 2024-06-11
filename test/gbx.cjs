const express = require('express');
const { ethers } = require('ethers');
const app = express();

// 环境变量配置
require('dotenv').config();
const apiKey = process.env.API_KEY; // 从环境变量读取API密钥
const providerUrl = process.env.PROVIDER_URL; // BEVM网络的RPC URL
const gbxContractAddress = process.env.GBXCONTRACT_ADDRESS; // GenesisBox 合约地址

console.log("API Key:", apiKey);
console.log("Provider URL:", providerUrl);
console.log("GenesisBox Contract Address:", gbxContractAddress);

// 设置以太坊提供者
const provider = new ethers.JsonRpcProvider(providerUrl);

// 合约ABI
const contractABI = [
  // 定义你需要使用的合约方法的ABI
  {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
  }
];

// 创建合约实例
const contract = new ethers.Contract(gbxContractAddress, contractABI, provider);

app.use(express.json());

app.post('/gbx', async (req, res) => {
  const { userId, accounts } = req.body;
  const headers = req.headers;

  console.log("Headers:", headers);
  console.log("Request Body:", req.body);

  // 验证API密钥
  if (apiKey !== headers['x-api-key']) {
    console.log("Invalid API Key");
    return res.status(400).send({
      message: 'Invalid API Key'
    });
  }

  // 获取用户EVM地址
  const userWallet = accounts.wallet;
  console.log("User Wallet:", userWallet);

  // 验证钱包地址是否有效
  if (!userWallet || userWallet === '0x0000000000000000000000000000000000000000') {
    console.log("Invalid wallet address");
    return res.status(400).send({
      message: 'Invalid wallet address'
    });
  }

  try {
    const balance = await contract.balanceOf(userWallet);
    console.log("Balance:", balance, "GBX");

    if (balance > 0) {
      console.log("User holds GBX");
      return res.status(200).send({
        message: "User holds GBX"
      });
    } else {
      console.log("User does not hold GBX");
      return res.status(400).send({
        message: "User does not hold GBX"
      });
    }
  } catch (error) {
    console.error("Error checking balance:", error.message);
    console.error("Stack Trace:", error.stack);
    return res.status(400).send({
      message: 'Error checking balance',
      error: error.message,
      data: error.transaction?.data,
      to: error.transaction?.to
    });
  }
});

// Add a handler for the root path to help diagnose issues
app.get('/', (req, res) => {
  res.send('API is running');
});

app.listen(3001, () => console.log('Running on port 3001'));