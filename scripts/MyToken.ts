import { ethers } from "hardhat";
import * as dotenv from "dotenv";
dotenv.config();

const TOKENS_MINTED = ethers.utils.parseEther("1");
async function main() {
  const [deployer, acc1, acc2] = await ethers.getSigners();
  const myTokenContractFactory = await ethers.getContractFactory("MyToken");
  const myTokenContract = await myTokenContractFactory.deploy();
  await myTokenContract.deployed();
  console.log(
    `MyToken contract was deployed at the address of ${myTokenContract.address}\n`
  );
  const totalSupply = await myTokenContract.totalSupply();
  console.log(
    `The initial total supply of this contract after deployment is ${totalSupply}\n`
  );
  console.log("Minting new tokens for Acc1");
  const mintTx = await myTokenContract.mint(acc1.address, TOKENS_MINTED);
  mintTx.wait();
  const totalSupplyAfter = await myTokenContract.totalSupply();
  console.log(
    `The initial total supply of this contract after minting is ${ethers.utils.formatEther(
      totalSupplyAfter
    )}\n`
  );
  console.log("What is the current VotePower of acc1?");
  const acc1InitialVotingPowerAfterMint = await myTokenContract.getVotes(
    acc1.address
  );
  console.log(
    `The vote balance of acc1 after minting is ${ethers.utils.formatEther(
      acc1InitialVotingPowerAfterMint
    )}\n`
  );
  console.log("Delegating from acc1 to acc1");
  const delegateTx = await myTokenContract.connect(acc1).delegate(acc1.address);
  await delegateTx.wait();
  const acc1InitialVotingPowerAfterDelegate = await myTokenContract.getVotes(
    acc1.address
  );
  console.log(
    `The vote balance of acc1 after self delegating is ${ethers.utils.formatEther(
      acc1InitialVotingPowerAfterDelegate
    )}\n`
  );
  const currentBlock = await ethers.provider.getBlock("latest");
  console.log(`The current block number is ${currentBlock.number}\n`);
  const mintTx2 = await myTokenContract.mint(acc2.address, TOKENS_MINTED);
  mintTx2.wait();
  const currentBlock2 = await ethers.provider.getBlock("latest");
  console.log(`The current block number is ${currentBlock2.number}\n`);
  const mintTx3 = await myTokenContract.mint(acc2.address, TOKENS_MINTED);
  mintTx3.wait();
  const currentBlock3 = await ethers.provider.getBlock("latest");
  console.log(`The current block number is ${currentBlock3.number}\n`);
  const pastVotes = await Promise.all([
    await myTokenContract.getPastVotes(acc1.address, 4),
    await myTokenContract.getPastVotes(acc1.address, 3),
    await myTokenContract.getPastVotes(acc1.address, 2),
    await myTokenContract.getPastVotes(acc1.address, 1),
    await myTokenContract.getPastVotes(acc1.address, 0),
  ]);
  console.log({ pastVotes });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
