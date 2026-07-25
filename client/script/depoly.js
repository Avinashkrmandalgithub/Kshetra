import { network } from "hardhat";

async function main() {
  const { ethers } = await network.connect();
  const landContract = await ethers.deployContract("AllLandRegistry");
  await landContract.waitForDeployment();
  console.log("Issue contract deployed address:", await landContract.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
