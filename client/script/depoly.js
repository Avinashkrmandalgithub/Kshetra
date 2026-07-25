import hre from "hardhat"
async function main(){
    const Landcontract= await hre.ethers.getContractFactory("AllLandRegistry");
    const d_Landcontract = await Landcontract.deploy();
    await d_Landcontract.waitForDeployment();
    console.log("Issue contract in deopoly address: ",await d_Landcontract.getAddress());
}
main().then(()=> process.exit(0)).catch((error)=>{
console.log(error)
process.exit(1)
})