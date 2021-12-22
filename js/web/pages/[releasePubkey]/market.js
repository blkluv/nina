import ninaCommon from "nina-common";
import Head from "next/head";
import Release from "../../components/Release";

const { NinaClient } = ninaCommon.utils;

const ReleaseMarketPage = (props) => {
  const { metadata } = props;
  return (
    <>
      <Head>
        <title>{`Nina: ${metadata?.properties.artist} - ${metadata?.properties.title} (Market)`}</title>
        <meta
          name="description"
          content={`Secondary Market for ${metadata?.properties.artist} - ${metadata?.properties.title}. \n Published on Nina.`}
        />
        <meta name="og:type" content="website" />
        <meta
          name="og:title"
          content={`Nina: ${metadata?.properties.artist} - ${metadata?.properties.title} (Market)`}
        />
        <meta
          name="og:description"
          content={`Releases related to ${metadata?.properties.artist} - ${metadata?.properties.title}. \n Published on Nina.`}
        />
        <meta name="twitter:card" content="player" />
        <meta
          name="twitter:player"
          content={`https://${host}/player/${releasePubkey}`}
        />
        <meta name="twitter:player:stream" content={metadata.animation_url} />
        <meta name="twitter:player:width" content="400" />
        <meta name="twitter:player:height" content="400" />
        <meta name="twitter:site" content="@nina_market_" />
        <meta name="twitter:creator" content="@nina_market_" />
        <meta name="twitter:image:type" content="image/jpg" />
        <meta
          name="twitter:title"
          content={`${metadata?.properties.artist} - "${metadata?.properties.title}" on Nina`}
        />
        <meta name="twitter:description" content={metadata?.description} />
        <meta name="twitter:image" content={metadata.image} />
        <meta name="og:image" content={metadata.image} />
      </Head>
      <Release {...props} />
    </>
  );
};

export const getServerSideProps = async (context) => {
  const releasePubkey = context.params.releasePubkey;
  const metadataResult = await fetch(
    `${NinaClient.endpoints.api}/metadata/bulk`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: [releasePubkey] }),
    }
  );
  const metadataJson = await metadataResult.json();
  return {
    props: {
      metadata: metadataJson[releasePubkey],
      releasePubkey,
    },
  };
};

export default ReleaseMarketPage;
