import { AddressZero } from "@ethersproject/constants";
import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

(async () => {
  try {
    const nftCollectionAddress = await sdk.deployer.deployNFTCollection({
      // The collection's name, ex. CryptoPunks
      name: "Member of Exclusive Marketiverse Club",
      // A description for the collection.
      description: "A semi-secret society for digital marketers.",
      // The image that will be held on our NFT! The fun part :).
      image: readFileSync("scripts/assets/2501.png"),
      // We need to pass in the address of the person who will be receiving the proceeds from sales of nfts in the contract.
      // We're planning on not charging people for the drop, so we'll pass in the 0x0 address
      // you can set this to your own wallet address if you want to charge for the drop.
      primary_sale_recipient: AddressZero,
    });

    // this initialization returns the address of our contract
    // we use this to initialize the contract on the thirdweb sdk
    const nftCollection = await sdk.getContract(nftCollectionAddress, "nft-collection");

    // with this, we can get the metadata of our contract
    const metadata = await nftCollection.metadata.get();

    console.log(
      "✅ Successfully deployed nftCollection contract, address:",
      nftCollectionAddress,
    );
    console.log("✅ nftCollection metadata:", metadata);
  } catch (error) {
    console.log("failed to deploy nftCollection contract", error);
  }
})();