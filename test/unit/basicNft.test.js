const { inputToConfig } = require("@ethereum-waffle/compiler")
const { assert, expect } = require("chai")
const { network, deployments, ethers, getNamedAccounts } = require("hardhat")
const { developmentChains, networkConfig } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("BasicNFT Unit Tests", function () {
          let basicNFTContract

          beforeEach(async () => {
              const { deployer } = await getNamedAccounts()
              await deployments.fixture(["basicnft"])
              basicNFTContract = await ethers.getContract("BasicNft", deployer)
          })

          describe("constructor", function () {
              it("initialize the contract correctly", async () => {
                  const tokenCounter = (await basicNFTContract.getTokenCounter()).toString()
                  assert.equal(tokenCounter, "0")
              })
          })
      })
