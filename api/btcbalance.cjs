const { ethers } = require('ethers');

// 环境变量配置
require('dotenv').config();
const apiKey = process.env.API_KEY; // 从环境变量读取API密钥
const providerUrl = process.env.PROVIDER_URL; // BEVM网络的RPC URL

console.log("API Key:", apiKey);
console.log("Provider URL:", providerUrl);

const provider = new ethers.JsonRpcProvider(providerUrl);

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
        const balance = await provider.getBalance(userWallet);
        const balanceInBTC = ethers.formatEther(balance); // BEVM网络的原生资产转换为BTC
    
        console.log("Balance:", balanceInBTC, "BTC");
    
        if (parseFloat(balanceInBTC) > 0.00001) {
          console.log("User holds sufficient BTC");
          return res.status(200).send({
            message: "User holds sufficient BTC"
          });
        } else {
          console.log("User does not hold sufficient BTC");
          return res.status(400).send({
            message: "User does not hold sufficient BTC"
          });
        }
      } catch (error) {
        console.error("Error checking balance:", error.message);
        console.error("Stack Trace:", error.stack);
        return res.status(400).send({
          message: 'Error checking balance',
          error: error.message
        });
    }
};