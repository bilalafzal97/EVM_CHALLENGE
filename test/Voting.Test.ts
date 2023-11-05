import { assert} from "chai";
import { ethers } from "hardhat";
import { Voting__factory, Voting } from "../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("Voting", function() {

  let votingFactory: Voting__factory;
  let voting: Voting;

  let signers;
  let ownerSigner: SignerWithAddress;
  let voter1Signer: SignerWithAddress;
  let voter2Signer: SignerWithAddress;
  let voter3Signer: SignerWithAddress;
  let voter4Signer: SignerWithAddress;
  let voter5Signer: SignerWithAddress;
  let voter6Signer: SignerWithAddress;

  it("Setup Accounts", async function() {
    signers = await ethers.getSigners();
    ownerSigner = await ethers.getSigner(signers[0].address);
    voter1Signer = await ethers.getSigner(signers[1].address);
    voter2Signer = await ethers.getSigner(signers[2].address);
    voter3Signer = await ethers.getSigner(signers[3].address);
    voter4Signer = await ethers.getSigner(signers[4].address);
    voter5Signer = await ethers.getSigner(signers[5].address);
    voter6Signer = await ethers.getSigner(signers[6].address);
  });

  it("Setup Contract", async function() {
    votingFactory = await ethers.getContractFactory("Voting");
    voting = await votingFactory.deploy();
    await voting.deployed();
  });

  it("Setup Voting Items", async function() {
    await voting.proposeItem("Bitcoin");
    await voting.proposeItem("ETH");
    await voting.proposeItem("BSC");

    assert((await voting.items(0)).name == "Bitcoin");
    assert((await voting.items(1)).name == "ETH");
    assert((await voting.items(2)).name == "BSC");
  });

  it("Cast Votes", async function() {
    await voting.connect(voter1Signer).voteForItem(0);
    await voting.connect(voter2Signer).voteForItem(1);
    await voting.connect(voter3Signer).voteForItem(1);
    await voting.connect(voter4Signer).voteForItem(1);
    await voting.connect(voter5Signer).voteForItem(2);
    await voting.connect(voter6Signer).voteForItem(2);

    assert((await voting.items(0)).voteCount.toNumber() == 1);
    assert((await voting.items(1)).voteCount.toNumber() == 3);
    assert((await voting.items(2)).voteCount.toNumber() == 2);
  });

  it("Cast Votes Failed", async function() {
    try {
      await voting.connect(voter1Signer).voteForItem(0);
    } catch (error: any) {
      assert(error.message == "VM Exception while processing transaction: reverted with reason string 'You have already voted for an item'");
    }
  });

  it("Get Winner", async function() {
    const winner = await voting.getWinner();

    assert(winner.winnerId.toNumber() == 1);
    assert(winner.maxVotes.toNumber() == 3);
    assert(winner.winnerName == "ETH");
  });

});