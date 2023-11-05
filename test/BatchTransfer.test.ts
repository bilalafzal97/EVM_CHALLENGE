import { assert } from "chai";
import { ethers } from "hardhat";
import { BatchTransfer__factory, BatchTransfer } from "../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("Voting", function() {

  let batchTransferFactory: BatchTransfer__factory;
  let batchTransfer: BatchTransfer;

  let signers;
  let ownerSigner: SignerWithAddress;
  let receiver1Signer: SignerWithAddress;
  let receiver2Signer: SignerWithAddress;
  let receiver3Signer: SignerWithAddress;

  it("Setup Accounts", async function() {
    signers = await ethers.getSigners();
    ownerSigner = await ethers.getSigner(signers[0].address);
    receiver1Signer = await ethers.getSigner(signers[1].address);
    receiver2Signer = await ethers.getSigner(signers[2].address);
    receiver3Signer = await ethers.getSigner(signers[3].address);
  });

  it("Setup Contract", async function() {
    batchTransferFactory = await ethers.getContractFactory("BatchTransfer");
    batchTransfer = await batchTransferFactory.deploy();
    await batchTransfer.deployed();
  });

  it("transfer batch", async function() {
    await batchTransfer.transferBatch([
        receiver1Signer.address,
        receiver2Signer.address,
        receiver3Signer.address
      ], [
        ethers.utils.parseEther("100"),
        ethers.utils.parseEther("200"),
        ethers.utils.parseEther("300")
      ],
      {
        value: ethers.utils.parseEther("600")
      }
    );

    assert(Number(ethers.utils.formatUnits(await ethers.provider.getBalance(receiver1Signer.address))) == 10100);
    assert(Number(ethers.utils.formatUnits(await ethers.provider.getBalance(receiver2Signer.address))) == 10200);
    assert(Number(ethers.utils.formatUnits(await ethers.provider.getBalance(receiver3Signer.address))) == 10300);
  });

});