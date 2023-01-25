const { inputToConfig } = require("@ethereum-waffle/compiler")
const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Random IFS Unit Test", () => {
          let randomIpfsNft, deployer, vrfCoordinatorV2Mock

          beforeEach(async () => {
              accounts = await ethers.getSigners()
              deployer = accounts[0]
              await deployments.fixture(["mocks", "randomipfs"])
              randomIpfsNft = await ethers.getContract("RandomIpfsNft", deployer)
              vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer)
          })

          describe("Constructor", () => {
              it("Sets starting values correctly", async () => {
                  const dogTokenUriZero = await randomIpfsNft.getDogTokenUris(0)
                  const isInitialized = await randomIpfsNft.getInitialized()

                  assert(dogTokenUriZero.includes("ipfs://"))
                  assert.equal(isInitialized, true)
              })
          })

          describe("RequestNFT", () => {
              it("Fails if payment isn't sent with the request", async () => {
                  await expect(randomIpfsNft.requestNft()).to.be.revertedWith(
                      "RandomIpfsNft__NeedMoreETHSent"
                  )
              })

              it("Reverts if payment amount is less than the mint fee", async () => {
                  const fee = await randomIpfsNft.getMintFee()
                  await expect(
                      randomIpfsNft.requestNft({ value: fee.sub(ethers.utils.parseEther("0.001")) })
                  ).to.be.revertedWith("RandomIpfsNft__NeedMoreETHSent")
              })

              it("Emits an event and kicks off a random word request", async () => {
                  const fee = await randomIpfsNft.getMintFee()
                  await expect(randomIpfsNft.requestNft({ value: fee.toString() })).to.emit(
                      randomIpfsNft,
                      "NftRequested"
                  )
              })
          })

          describe("FulfillRandomWords", () => {
              it("Mints NFT after random number is returned", async () => {
                  await new Promise(async (resolve, reject) => {
                      randomIpfsNft.once("NftMinted", async () => {
                          try {
                              const tokenUri = await randomIpfsNft.tokenURI("0")
                              const tokenCounter = await randomIpfsNft.getTokenCounter()

                              assert.equal(tokenUri.toString().includes("ipfs://"), true)
                              assert.equal(tokenCounter.toString(), "1")
                              resolve()
                          } catch (e) {
                              console.log(e)
                              reject(e)
                          }
                      })
                      try {
                          const fee = await randomIpfsNft.getMintFee()
                          const requestNftResponse = await randomIpfsNft.requestNft({
                              value: fee.toString(),
                          })
                          const requestNftReceipt = await requestNftResponse.wait(1)
                          await vrfCoordinatorV2Mock.fulfillRandomWords(
                              requestNftReceipt.events[1].args.requestId,
                              randomIpfsNft.address
                          )
                      } catch (e) {
                          console.log(e)
                          reject(e)
                      }
                  })
              })
          })

          describe("getBreedFromModdedRng", () => {
              it("Should return pug if moddedRng < 10", async () => {
                  const expectedValue = await randomIpfsNft.getBreedFromModdedRng(9)
                  assert.equal(0, expectedValue)
              })
              it("Should return shiba-inu if moddedRng is between 10 - 39", async () => {
                  const expectedValue = await randomIpfsNft.getBreedFromModdedRng(11)
                  assert.equal(1, expectedValue)
              })
              it("Should return st. bernard if moddedRng is between 40 - 99", async () => {
                  const expectedValue = await randomIpfsNft.getBreedFromModdedRng(41)
                  assert.equal(2, expectedValue)
              })
              it("Should revert if moddedRng > 99", async () => {
                  await expect(randomIpfsNft.getBreedFromModdedRng(100)).to.be.revertedWith(
                      "RandomIpfsNft__RangeOutOfBounds"
                  )
              })
          })
      })
