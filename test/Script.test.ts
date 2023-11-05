import { assert } from "chai";
import { ethers } from "hardhat";
import { TestToken__factory, TestToken } from "../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("Voting", function() {

  let testTokenFactory: TestToken__factory;
  let testToken: TestToken;

  let signers;
  let ownerSigner: SignerWithAddress;
  let receiver1Signer: SignerWithAddress;
  let receiver2Signer: SignerWithAddress;
  let receiver3Signer: SignerWithAddress;

  const contractABI = [
    {
      constant: true,
      inputs: [],
      name: "totalSupply",
      outputs: [{ name: "", type: "uint256" }],
      type: "function"
    },
    {
      constant: false,
      inputs: [
        { name: "_to", type: "address" },
        { name: "_amount", type: "uint256" }
      ],
      name: "mint",
      outputs: [],
      type: "function"
    }
  ];

  it("Setup Accounts", async function() {
    signers = await ethers.getSigners();
    ownerSigner = await ethers.getSigner(signers[0].address);
    receiver1Signer = await ethers.getSigner(signers[1].address);
    receiver2Signer = await ethers.getSigner(signers[2].address);
    receiver3Signer = await ethers.getSigner(signers[3].address);
  });

  it("Setup Contract", async function() {
    testTokenFactory = await ethers.getContractFactory("TestToken");
    testToken = await testTokenFactory.deploy();
    await testToken.deployed();
  });

  it("Setup Contract", async function() {
    testTokenFactory = await ethers.getContractFactory("TestToken");
    testToken = await testTokenFactory.deploy();
    await testToken.deployed();
  });

  it("Scripts Test", async function() {
    const contract = new ethers.Contract(testToken.address, contractABI, ethers.provider);

    const preSupply = await contract.totalSupply();

    assert(Number(ethers.utils.formatUnits(preSupply)) == 0);

    await contract.connect(ownerSigner).mint(receiver1Signer.address, ethers.utils.parseEther("100"));
    await contract.connect(ownerSigner).mint(receiver2Signer.address, ethers.utils.parseEther("200"));
    await contract.connect(ownerSigner).mint(receiver3Signer.address, ethers.utils.parseEther("300"));

    const postSupply = await contract.totalSupply();

    assert(Number(ethers.utils.formatUnits(postSupply)) == 600);
  });

});