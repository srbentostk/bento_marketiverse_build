import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

(async () => {
  try {
    const editionDrop = await sdk.getContract("0x901D66E338eb411B3CA3aB4398D7491f9ed79735", "edition-drop");
    await editionDrop.createBatch([
      {
        name: "Member NFT",
        description: "This NFT will give you access to an amazing Semi-Secret Society as regular member!",
        image: readFileSync("scripts/assets/234.png"),
      },
    ]);
    console.log("✅ Successfully created a new NFT in the drop!");
  } catch (error) {
    console.error("failed to create the new NFT", error);
  }
})();