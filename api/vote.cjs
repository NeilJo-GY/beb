const { ethers } = require('ethers');

// 环境变量配置
const apiKey = process.env.API_KEY; // 从环境变量读取API密钥
const providerUrl = process.env.PROVIDER_URL; // BEVM网络的RPC URL
const contractAddress = process.env.CONTRACT_ADDRESS; // 投票合约地址

console.log("API Key:", apiKey);
console.log("Provider URL:", providerUrl);
console.log("Contract Address:", contractAddress);

// 设置以太坊提供者
const provider = new ethers.providers.JsonRpcProvider(providerUrl);

// 合约ABI
const contractABI = [
  // 定义你需要使用的合约方法的ABI
  {
    "inputs": [
        {
            "internalType": "address",
            "name": "",
            "type": "address"
        },
        {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }
    ],
    "name": "userVotes",
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
const contract = new ethers.Contract(contractAddress, contractABI, provider);

module.exports = async (req, res) => {
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

  try {
    const projectId = 68; // XGEO项目的ID，具体值根据实际情况修改
    console.log("Project ID:", projectId);

    const votes = await contract.userVotes(userWallet, projectId);
    console.log("Votes:", votes);

    if (votes > 0n) {
            console.log("User has voted for the project");
            return res.status(200).send({
                message: "User completed the action"
            });
        } else {
            console.log("User has not voted for the project");
            return res.status(400).send({
                message: "User has not voted for the project"
            });
        }
    } catch (error) {
    console.error("Error checking vote status:", error.message);
    console.error("Stack Trace:", error.stack);
    return res.status(400).send({
        message: 'Error checking vote status',
        error: error.message
    });
  }
};