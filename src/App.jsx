import {
  useAddress,
  ConnectWallet,
  useContract,
  useNFTBalance,
} from "@thirdweb-dev/react";
import { useState, useEffect, useMemo } from "react";
import { Web3Button } from "@thirdweb-dev/react";
const App = () => {
  //Just to storage img and name
  const [contract, setContract] = useState();
  const [nftName, setNftName] = useState();
  const [nftImage, setNftImage] = useState();
  const [contract_Member, setConctract_Member] = useState();
  const [nftName_Member, setNftName_Member] = useState();
  const [nftImage_Member, setNftImage_Member] = useState();

  const DisplayNFT = ({ name, image, name_member, image_member }) => {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }} /* className="nft-display" */
      >
        <img
          src={image_member}
          style={{
            maxHeight: "400px",
            borderRadius: "4px",
            marginRight: "10px",
          }}
          alt={name_member}
        />
        <p /* style={{fontFamily: "Roboto"}} */>{name_member}</p>
        <img
          src={image}
          style={{
            maxHeight: "400px",
            borderRadius: "4px",
            marginRight: "10px",
          }}
          alt={name}
        />
        <p>{name}</p>
      </div>
    );
  };
  const clearNFTs = () => {
    setNftName("");
    setNftImage("");
    setNftName_Member("");
    setNftImage_Member("");
  };
  // Use the hooks thirdweb give us.
  const address = useAddress();
  console.log("👋 Address:", address);
  // Initialize our Edition Drop contract
  const editionDropAddress = "0xA3b58d7D0c3641dcAB058DDb7fed83e528D47b68";
  const nftCollectionAddress = "0xba3d14D5C6cC60e99Da06E908841aFe0998C65bE";
  const erc721Address = "0xba3d14D5C6cC60e99Da06E908841aFe0998C65bE";
  const editionDropAddressMember = "0x901D66E338eb411B3CA3aB4398D7491f9ed79735";
  // Initialize our token contract
  const { contract: editionDropMember } = useContract(
    editionDropAddressMember,
    "edition-drop"
  );
  const { contract: token } = useContract(
    "0xA3b58d7D0c3641dcAB058DDb7fed83e528D47b68",
    "token"
  );
  const { contract: editionDrop } = useContract(
    editionDropAddress,
    "edition-drop"
  );
  const { contract: nftCollection } = useContract(
    nftCollectionAddress,
    "nft-collection"
  );
  // Hook to check if the user has our NFT
  const { data: nftBalance } = useNFTBalance(editionDrop, address, "0");
  // Hook to check if the user has member NFT
  const { data: nftCollectionNFT } = useNFTBalance(nftCollection, address, "0");
  const { data: nftEditionDropMember } = useNFTBalance(
    editionDropMember,
    address,
    "0"
  );
  //Check if the user has Investor NFT
  const hasClaimedNFT = useMemo(() => {
    return nftBalance && nftBalance.gt(0);
  }, [nftBalance]);
  //Check if the user has Member NFT
  const hasEditionDropMember = useMemo(() => {
    return nftEditionDropMember && nftEditionDropMember.gt(0);
  }, [nftEditionDropMember]);
  //Check if the user has any NFT at all
  const hasAnyNFT = useMemo(() => {
    return hasClaimedNFT || hasEditionDropMember;
  }, [hasClaimedNFT, hasEditionDropMember]);
  // Holds the amount of token each member has in state.
  const [memberTokenAmounts, setMemberTokenAmounts] = useState([]);
  // The array holding all of our members addresses.
  const [memberAddresses, setMemberAddresses] = useState([]);

  // A fancy function to shorten someones wallet address, no need to show the whole thing.
  const shortenAddress = (str) => {
    return str.substring(0, 6) + "..." + str.substring(str.length - 4);
  };

  // This useEffect grabs all the addresses of our members holding our NFT.
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    // Just like we did in the 7-airdrop-token.js file! Grab the users who hold our NFT
    // with tokenId 0.
    const getAllAddresses = async () => {
      try {
        const memberAddresses =
          await editionDrop?.history.getAllClaimerAddresses(0);
        setMemberAddresses(memberAddresses);
        // loop through all addresses and get the balance
        memberAddresses.forEach(async (memberAddress) => {
          const balance = await token.balanceOf(memberAddress);
          setMemberTokenAmounts((prevAmounts) => [...prevAmounts, balance]);
        });
        console.log("🚀 Members addresses", memberAddresses);
      } catch (error) {
        console.error("failed to get member list", error);
      }
    };
    getAllAddresses();
  }, [hasClaimedNFT, editionDrop?.history]);
  // New function to display NFTs
  const displayNFTs = async () => {
    try {
      // Get the NFTs owned by the user
      const nfts_member = await editionDropMember.getOwned(address);
      const nfts = await editionDrop.getOwned(address);
      console.log("NFTs encontrados para o endereço: ", address);
      console.log("NFTs do contrato editionDrop: ", nfts);
      console.log("NFTs do contrato editionDropMember: ", nfts_member);
      // Get the metadata for each NFT
      for (let i = 0; i < nfts.length; i++) {
        const tokenId = nfts[i];
        const nft = await editionDrop.get(tokenId);
        const nftmeta = await editionDrop.get("0");
        const metadata_editionDrop = nftmeta.metadata;
        console.log(
          "Metadata editionDrop antes de image and name: ",
          metadata_editionDrop
        );
        const image_editionDrop = metadata_editionDrop.image;
        const name_editionDrop = metadata_editionDrop.name;
        setNftName(name_editionDrop);
        setNftImage(image_editionDrop);
        console.log("Informações de NFT adquiridas para editionDrop: ", nft);
        console.log("Metadata editionDrop: ", metadata_editionDrop);
      }
      for (let i = 0; i < nfts_member.length; i++) {
        const tokenId_member = nfts_member[i];
        const nft_member = await editionDropMember.get(tokenId_member);
        const nft_membermeta = await editionDropMember.get("0");
        console.log("nft_member: ", nft_member);
        const metadata_editionDropMember = nft_membermeta.metadata;
        console.log("metadata_editionDropMember: ", metadata_editionDropMember);
        const image_editionDropMember = metadata_editionDropMember.image;
        const name_editionDropMember = metadata_editionDropMember.name;
        setNftName_Member(name_editionDropMember);
        setNftImage_Member(image_editionDropMember);
        console.log(
          "Informações de NFT adquiridas para editionDropMember: ",
          nft_member
        );
        console.log("Metadata editionDropMember: ", metadata_editionDropMember);
      }
    } catch (err) {
      console.error("Erro ao buscar NFTs do usuário: ", err);
    }
  };
  // This useEffect call the displayNFTs function 2  seconds after the page load

  // This useEffect grabs the # of token each member holds.
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    const getAllBalances = async () => {
      try {
        const amounts = await token?.history.getAllHolderBalances();
        setMemberTokenAmounts(amounts);
        console.log("👜 Amounts", amounts);
      } catch (error) {
        console.error("failed to get member balances", error);
      }
    };
    getAllBalances();
  }, [hasClaimedNFT, token?.history]);

  // Now, we combine the memberAddresses and memberTokenAmounts into a single array
  const memberList = useMemo(() => {
    return memberAddresses.map((address) => {
      // We're checking if we are finding the address in the memberTokenAmounts array.
      // If we are, we'll return the amount of token the user has.
      // Otherwise, return 0.
      const member = memberTokenAmounts?.find(
        ({ holder }) => holder === address
      );

      return {
        address,
        tokenAmount: member?.balance.displayValue || "0",
      };
    });
  }, [memberAddresses, memberTokenAmounts]);
  // ... include all your other code that was already there below.
  // This is the case where the user hasn't connected their wallet
  // to your web app. Let them call connectWallet.
  useEffect(() => {
    if (!nftBalance || !nftBalance.gt(0)) {
      return;
    }

    const getTokenUri = async () => {
      try {
        const tokenUri = await editionDrop?.getTokenUri(0);
        console.log("🖼️ Token URI", tokenUri);
      } catch (error) {
        console.error("failed to get token URI", error);
      }
    };
    getTokenUri();
  }, [nftBalance, editionDrop]);
  
  useEffect(() => {
    if (hasAnyNFT) {
      clearNFTs();
      displayNFTs();
    }
}, [address, hasAnyNFT]);

  
  if (!address) {
    return (
      <div className="landing">
        <h1>Welcome to The Exclusive Marketiverse Semi-secret Society</h1>
        <div className="btn-hero">
          <ConnectWallet />
        </div>
      </div>
    );
  }
  
  if (hasAnyNFT) {
    return (
      <div className="member-page">
        <button onClick={displayNFTs}>Display NFTs</button>
        {nftName && nftImage ? (
          <DisplayNFT name={nftName} image={nftImage} />
        ) : (
          <p>No NFTs to display</p>
        )}
        {nftName_Member && nftImage_Member ? (
          <DisplayNFT name={nftName_Member} image={nftImage_Member} />
        ) : (
          <p>No Member NFTs to display</p>
        )}
        <h1> Member Page</h1>
        <p>Congratulations on being a member, see our Whitepaper:</p>
        <h1>Introduction</h1>
        <p>
          The semi-secret society is a platform based on blockchain technology
          that is focused on digital marketing. It offers a range of membership
          categories, including Founders, Investors, Producer Partners, Honorary
          Members, VIP Members, Black Members, Advanced Members, Intermediate
          Members, Beginner Members, Students, and Determined Students. It also
          has categories for audience members, including Audience, Fan Audience,
          and Determined Audience.
        </p>
        <h2>Membership Categories</h2>
        <h3>Founders</h3>
        <p>
          Founders are the highest tier of membership in the society. They have
          the ability to create categories of NFTs and events within the club,
          as well as hold NFTs of Founder status which grant them voting rights
          in the DAO and a percentage of dividends.
        </p>
        <h3>Investors</h3>
        <p>
          Investors are a tier below Founders, and have the ability to suggest
          features and events within the club, but do not have voting rights.
          They hold NFTs of Investor status which grant them a percentage of
          dividends. Both Founders and Investors have access to all events and
          materials within the metaverse and are invited to high-class events
          within the metaverse.
        </p>
        <h3>Honorary Members</h3>
        <p>
          Honorary Members are invited by Founders or recommended by Investors
          and approved by Founders to participate in the metaverse. They hold
          NFTs of Honorary Member status which cannot be transferred or sold.
          These members are able to create both free and paid content for the
          platform, as well as host online and in-person events that can be
          either free or paid. For any paid content or events produced by
          Honorary Members, 90% of the sale value will go to their wallet, with
          the remaining 10% going to the metaverse contract. Any resale of
          content that is enabled for resale will also generate a commission of
          8% for the member's wallet and 6% for the metaverse contract. Honorary
          Members have exclusive communication platforms with Founders and
          Investors, as well as among themselves. Honorary Members are also
          invited to high-class events within the metaverse.
        </p>
        <h3>Producer Partners</h3>
        <p>
          Producer Partners are holders of content producer NFTs. These NFTs are
          sold by Founders and Investors, and all content produced by a Producer
          Partner must be moderated before being released. This category allows
          for the creation of content that is accessible through student NFTs,
          with 85% of the sale value of these NFTs on the primary market going
          directly to the partner, with the remaining 15% going to the metaverse
          contract. The producer can receive the value in D+ Guarantee. The
          producer can also receive tokens for completed tasks. Each dollar
          earned with any work also generates 10% in token units.
        </p>
        <h3>VIP Members</h3>
        <p>
          VIP Members are a tier below Honorary Members and are able to create
          and sell content on the platform, with 75% of the sale value going to
          their wallet and 25% going to the metaverse contract. They can also
          host online and in-person events that can be either free or paid, with
          80% of the sale value going to their wallet and 20% going to the
          metaverse contract. VIP Members are able to purchase NFTs of any type,
          except for Founder and Investor NFTs.
        </p>
        <h3>Black Members</h3>
        <p>
          Black Members are a tier below VIP Members and are able to create and
          sell content on the platform, with 70% of the sale value going to
          their wallet and 30% going to the metaverse contract. They can also
          host online and in-person events that can be either free or paid, with
          75% of the sale value going to their wallet and 25% going to the
          metaverse contract. Black Members are able to purchase NFTs of any
          type, except for Founder and Investor NFTs.
        </p>
        <h3>Advanced Members</h3>
        <p>
          Advanced Members are a tier below Black Members and are able to create
          and sell content on the platform, with 65% of the sale value going to
          their wallet and 35% going to the metaverse contract. They can also
          host online and in-person events that can be either free or paid, with
          70% of the sale value going to their wallet and 30% going to the
          metaverse contract. Advanced Members are able to purchase NFTs of any
          type, except for Founder and Investor NFTs.
        </p>
        <h3>Intermediate Members</h3>
        <p>
          Intermediate Members are a tier below Advanced Members and are able to
          create and sell content on the platform, with 60% of the sale value
          going to their wallet and 40% going to the metaverse contract. They
          can also host online and in-person events that can be either free or
          paid, with 65% of the sale value going to their wallet and 35% going
          to the metaverse contract. Intermediate Members are able to purchase
          NFTs of any type, except for Founder and Investor NFTs.
        </p>
        <h3>Beginner Members</h3>
        <p>
          Beginner Members are the lowest tier of membership and are able to
          create and sell content on the platform, with 50% of the sale value
          going to their wallet and 50% going to the metaverse contract. They
          can also host online and in-person events that can be either free or
          paid, with 60% of the sale value going to their wallet and 40% going
          to the metaverse contract. Beginner Members are able to purchase NFTs
          of any type, except for Founder and Investor NFTs.
        </p>
        <h3>Students</h3>
        <p>
          Students are able to purchase and access certain content and events
          within the metaverse. They can also earn tokens for completing tasks.
          Each dollar earned with any work also generates 10% in token units.
        </p>
        <h3>Determined Students</h3>
        <p>
          Determined Students are a tier above regular Students and are able to
          access more content and events within the metaverse. They can also
          earn more tokens for completing tasks. Each dollar earned with any
          work also generates 15% in token units.
        </p>
        <h3>Audience</h3>
        <p>
          The Audience is able to access certain free content and events within
          the metaverse.
        </p>
        <h3>Fan Audience</h3>
        <p>
          Fan Audience is a tier above regular Audience and is able to access
          more content and events within the metaverse.
        </p>
        <h3>Determined Audience</h3>
        <p>
          Determined Audience is the highest tier of audience and is able to
          access the most content and events within the metaverse.
        </p>
        <h2>Possible Match-style Feature for UGC Producers and Payors</h2>
        <p>
          Those who produce in these resources earn tokens for completing tasks.
          Each dollar earned with any work also generates 10% in token units.
        </p>
        <p>A website/application that has a Match-style feature as follows:</p>
        <h3>Payor:</h3>
        <p>
          Person who has money and wants to hire a UGC production for use in
          Google Ads, Facebook Ads, Tiktok Ads.
        </p>
        <p>
          The payor fills out the proposal, which is the body of the UGC NFT.
        </p>
        <p>Notes:</p>
        <p>
          Type of proposal: auction (the price increases from x to y in time t)
          / cash (fixed value for period t)
        </p>
        <h3>Content Creator:</h3>
        <p>
          Person who creates content for social media and wants to sell their
          creation power.
        </p>
        <p>
          This content creator mints a Creator NFT containing their
          characteristics:
        </p>
        <ul>
          <li>
            Dashboard with views on platforms, link for verification, and
            completed UGC NFTs
          </li>
        </ul>
        <h3>UGC NFT</h3>
        <p>
          When a payor fills out this proposal, it appears in the marketplace
          after interacting with the UGC NFT smart contract. This smart contract
          receives the NFT and an USDC balance and holds it while displaying it
          as an NFT in the marketplace, which when a content creator acquires,
          will be signing a proposal and must deliver the result. Upon
          validation, they will receive the NFT in their wallet, along with the
          dollar balance paid by the contract.
        </p>
        <p>
          The UGC NFT may possibly include within it all content uploaded as
          NFTs as well, of the secret or non-secret type.
        </p>
        <h3>Validation of UGC</h3>
        <p>
          Once the creator accepts the project and the NFT creator accepts the
          content creator. Both receive a self-destructive UGC NFT that is an
          edition Project in Progress…
        </p>
        <p>
          When the content creator completes the work, they send it to the
          dashboard:
        </p>
        <ul>
          <li>Content files.</li>
          <li>Message:</li>
        </ul>
        <h1>The payor verifies</h1>
        <p>
          If the payor approves, the contract is completed and the Work in
          Progress NFTs give way to the completed UGC NFT. If the payor does not
          approve, they will have a message of the alteration or complaint type:
        </p>
        <h2>Alteration:</h2>
        <p>
          The content creator responds positively, I will make changes > in this
          case they must upload new files to enable another payor verification,
          and repeat the cycle.
        </p>
        <p>
          The content creator responds positively, but there will be an
          additional cost of so much:
        </p>
        <h3>Cost requirement:</h3>
        <p>
          If the payor pays, the dashboards enable file upload and completion
          verification again. If the payor rejects, it enables the option to
          pay, negotiate value, or complain.
        </p>
        <h2>Complaint:</h2>
        <p>
          They can request to cancel the complaint by releasing payment. They
          can request to speak with moderation, or pay a cancellation fee. Each
          complaint generates a cost, which can be negotiated or paid.
        </p>
        <p>
          The NFT of UGC in progress and the NFT of UGC completed are both
          non-transferable and non-sellable. They serve as proof of the work
          done and can be shown to other potential clients or used for
          self-promotion.
        </p>
        <p>
          The Members VIP category is reserved for those who have completed 10
          or more NFTs of UGC. These members have exclusive access to events and
          materials within the metaverse and can create and sell paid content on
          the platform. They also receive a higher percentage of the profits
          from the sale of their content, with 90% going to their wallet and 10%
          going to the metaverse contract.
        </p>
        <h1>The Members Black Category</h1>
        <p>
          The Members Black category is reserved for those who have completed
          100 or more NFTs of UGC. In addition to the benefits of the VIP
          category, Black members also have the ability to create and sell NFTs
          within the metaverse. They receive an even higher percentage of the
          profits from the sale of their content, with 95% going to their wallet
          and 5% going to the metaverse contract.
        </p>

        <h2>Other Membership Categories</h2>
        <p>
          The Members Advanced, Intermediate, and Beginner categories are for
          those who have completed a certain number of NFTs of UGC and have
          demonstrated a certain level of skill and expertise within the
          platform. These members have access to a range of events and materials
          within the metaverse, and can create and sell paid content on the
          platform. The percentage of profits from the sale of their content
          decreases as the member's level decreases, with Advanced members
          receiving 80%, Intermediate members receiving 70%, and Beginner
          members receiving 60%.
        </p>

        <h3>Students and Determined Students</h3>
        <p>
          Students and Determined Students are those who have purchased an NFT
          of a course or training within the metaverse. These members have
          access to the materials and events related to their purchased course
          and can work towards completing it. Upon completion, they may receive
          an NFT of completion or a higher level membership, depending on the
          course.
        </p>

        <h4>The Audience, Fan Audience, and Determined Audience</h4>
        <p>
          The Audience, Fan Audience, and Determined Audience categories are for
          those who are interested in the content and events within the
          metaverse but do not wish to create or sell their own content. These
          members have access to a range of free and paid materials and events,
          and can purchase NFTs of UGC or courses if they so choose.
        </p>

        <h5>Resolving Complaints</h5>
        <p>
          In the case of a complaint, the process for resolving it can be
          initiated. The options available to the parties involved include
          requesting to cancel the complaint and release the payment, requesting
          to speak with moderation, or agreeing to pay a cancellation fee. Each
          complaint generates a cost, which can be negotiated or paid. The NFT
          of UGC in progress and the NFT of UGC completed represent the status
          of the project and are integral to the process of creating and
          approving user-generated content on the platform. These NFTs allow for
          transparency and accountability in the creation of content and help to
          ensure that the platform remains a trusted source for high-quality
          user-generated content.
        </p>

        <h1>NFT of UGC completed</h1>
        <p>
          The NFT of UGC completed is a non-fungible token that represents the
          ownership of a piece of user-generated content that has been
          successfully completed and approved by the payer.
        </p>
        <p>
          This NFT can be resold on the secondary market, with the creator of
          content receiving a percentage of the sale.
        </p>
        <h2>Conclusion</h2>
        <p>
          In summary, the proposed platform aims to create a semi-secret society
          for those interested in digital marketing, using blockchain technology
          to facilitate the creation and exchange of user-generated content.
        </p>
        <p>
          The platform will offer various membership categories and rewards for
          participation, as well as a marketplace for the creation and sale of
          NFTs representing user-generated content.
        </p>
        <p>
          Through the use of smart contracts, the platform aims to provide a
          secure and transparent system for the creation and exchange of
          user-generated content, ensuring that creators are fairly compensated
          for their work and payers receive high-quality content for their
          campaigns.
        </p>

        <div>
          <div>
            git
            <h2>Member List</h2>
            <table className="card">
              <thead>
                <tr>
                  <th>Address</th>
                  <th>Token Amount</th>
                </tr>
              </thead>
              <tbody>
                {memberList.map((member) => {
                  return (
                    <tr key={member.address}>
                      <td>{shortenAddress(member.address)}</td>
                      <td>{member.tokenAmount}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
  // This is the case where we have the user's address
  // which means they've connected their wallet to our site!
  const id = 0;
  return (
    <>
      <div className="mint-nft">
        <h1>Mint your free (for now) Investor Membership NFT</h1>
        <p>
          Join a semi-secret society of digital marketing. There are several
          ways to join, decide which is best for you:
        </p>
        <p>
          <strong>Investor Partner</strong>: For those who want to invest money
          in the business and receive dividends, which are essentially quarterly
          profit shares of the company.
        </p>
        <p>
          <strong>Content Creator</strong>: Ideal for those with specific
          knowledge in the field of Digital Marketing, with the Content Creator
          NFT you can publish courses, ebooks, and events on the platform. Here
          you contribute by sharing knowledge and in return receive money,
          recognition, and unparalleled networking. Throughout your journey on
          the platform, you can receive NFTs that highlight you according to
          your achievements.
        </p>
        <p>
          <strong>Regular Member</strong>: Made for those who want to be part of
          the basic information and benefits of this society. A cheap and simple
          way to become a member of the semi-secret society.
        </p>
        <div className="btn-hero">
          <Web3Button
            contractAddress={editionDropAddress}
            action={(contract) => {
              contract.erc1155.claim(0, 1);
            }}
            onSuccess={() => {
              console.log(
                `🌊 Successfully Minted! Check it out on OpenSea: https://testnets.opensea.io/assets/${editionDrop.getAddress()}/0`
              );
            }}
            onError={(error) => {
              console.error("Failed to mint NFT", error);
            }}
          >
            Mint your Investor NFT (FREE)
          </Web3Button>
        </div>
      </div>
      <div className="mint-nft">
        <h1>Mint your free (for now) Member Membership NFT</h1>
        <p>
          Join a semi-secret society of digital marketing. There are several
          ways to join, decide which is best for you:
        </p>
        <div className="btn-hero">
          <Web3Button
            contractAddress={editionDropAddressMember}
            action={(contract) => {
              contract.erc1155.claim(0, 1);
            }}
            onSuccess={() => {
              console.log(
                `🌊 Successfully Minted! Check it out on OpenSea: https://testnets.opensea.io/assets/${editionDropMember.getAddress()}/0`
              );
            }}
            onError={(error) => {
              console.error("Failed to mint NFT", error);
            }}
          >
            Mint your Member NFT (FREE)
          </Web3Button>
        </div>
      </div>
    </>
  );
};

export default App;
