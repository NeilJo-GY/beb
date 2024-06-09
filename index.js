import { ethers } from "ethers";

const BEVMMAINNET_RPC_URL = "https://rpc-mainnet-1.bevm.io/";
const provider = new ethers.JsonRpcProvider(BEVMMAINNET_RPC_URL);

const abiProjectVotes = [
    "function projectVotes(uint256 id) public view returns (uint256)",
    "function projectVotesBatch(uint256[] memory ids) public view returns (uint256[] memory)",
    "function userVotes(address account, uint256 id) public view returns (uint256)",
    "function userVotesBatch(address user, uint256[] memory ids) public view returns (uint256[] memory)",
    "function exists(uint256 id) public view returns (bool)",
    "function projectName(uint256 id) public view returns (string memory)",
];
const addressVote = '0x3aaF53A884266Ea0c382FE320438f06f2AFC3804'
const contractVote = new ethers.Contract(addressVote, abiProjectVotes, provider)

const main = async () => {
    // 利用provider读取链上信息
    
    // 2. 查询provider连接到了哪条链
    console.log("\n2. 查询provider连接到了哪条链")
    const network = await provider.getNetwork();
    console.log(network.toJSON());

    // 3. 查询区块高度
    console.log("\n3. 查询区块高度")
    const blockNumber = await provider.getBlockNumber();
    console.log(blockNumber);

    // 5. 查询当前建议的gas设置
    console.log("\n5. 查询当前建议的gas设置")
    const feeData = await provider.getFeeData();
    console.log(feeData);

    // 6. 查询区块信息
    console.log("\n6. 查询区块信息")
    const block = await provider.getBlock(0);
    console.log(block);

    // 7. 给定合约地址查询合约bytecode，例子用的WETH地址
    // console.log("\n7. 给定合约地址查询合约bytecode")
    // const code = await provider.getCode(addressVote);
    // console.log(code);

    const projectId = 68;
    const votes = await contractVote.projectVotes(projectId);
    // 获取项目的名称
    const name = await contractVote.projectName(projectId);
    console.log(`项目 ${projectId} (${name}) 的票数:`, votes.toString());
}

main();