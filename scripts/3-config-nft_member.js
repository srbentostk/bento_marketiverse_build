import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

(async () => {
  try {
    const nftCollection = await sdk.getContract("0xba3d14D5C6cC60e99Da06E908841aFe0998C65bE", "nft-collection");
    await nftCollection.createBatch([
      {
        name: "Member NFT",
        description: "This NFT will give you access to an amazing Semi-Secret Society!",
        image: readFileSync("scripts/assets/2501.png"),
      },
    ]);
    console.log("✅ Successfully created a new NFT in the drop!");
  } catch (error) {
    console.error("failed to create the new NFT", error);
  }
})();