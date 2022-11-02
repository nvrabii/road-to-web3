import { useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";

import { TokenType } from "../types";
import { SearchResults, Form, Placeholder, LoadMore } from "../components";
import { getNFTs, getNFTsForCollection } from "../extern";

const Home: NextPage = () => {
  const [form, setForm] = useState({ wallet: "", collection: "" });
  const [tokens, setTokens] = useState<Array<TokenType>>([]);
  const [fetchedCount, setFetchedCount] = useState(0);
  const [pageKey, setPageKey] = useState("");
  const [startToken, setStartToken] = useState("");

  async function onLoadMore() {
    if (form.wallet.length) {
      const [fetchedTokens, newPageKey] = await getNFTs(
        form.wallet,
        form.collection,
        pageKey
      );

      setTokens([...tokens, ...fetchedTokens]);
      setFetchedCount(fetchedTokens.length);
      if (newPageKey?.length) setPageKey(newPageKey);
    } else if (form.collection.length) {
      const fetchedTokens = await getNFTsForCollection(
        form.collection,
        startToken
      );

      setTokens([...tokens, ...fetchedTokens]);
      setFetchedCount(fetchedTokens.length);
      if (fetchedTokens?.length)
        setStartToken(
          (fetchedTokens[fetchedTokens.length - 1].tokenId + 1).toLocaleString(
            "fullwide",
            { useGrouping: false }
          )
        );
    } else {
      console.log("Unsupported request");
      setFetchedCount(0);
    }
  }

  async function onFormSubmit() {
    setFetchedCount(0);
    setStartToken("");
    setPageKey("");

    if (form.wallet.length) {
      const [fetchedTokens, newPageKey] = await getNFTs(
        form.wallet,
        form.collection
      );

      setTokens(fetchedTokens);
      setFetchedCount(fetchedTokens.length);
      setPageKey(newPageKey);
    } else if (form.collection.length) {
      const fetchedTokens = await getNFTsForCollection(form.collection);

      setTokens(fetchedTokens);
      setFetchedCount(fetchedTokens.length);
      if (fetchedTokens?.length)
        setStartToken(
          (fetchedTokens[fetchedTokens.length - 1].tokenId + 1).toLocaleString(
            "fullwide",
            { useGrouping: false }
          )
        );
    } else {
      console.log("Unsupported request");
      setTokens([]);
      setFetchedCount(0);
    }
  }

  return (
    <>
      <Head>
        <title>NFT Gallery</title>
      </Head>
      <div className="flex min-h-screen flex-col items-center justify-center pt-8 pb-20">
        <div className="container">
          <Form form={form} setForm={setForm} onFormSubmit={onFormSubmit} />

          {tokens.length ? (
            <>
              <SearchResults tokens={tokens} />
              {fetchedCount === 100 ? <LoadMore handler={onLoadMore} /> : <></>}
            </>
          ) : (
            <div className="flex justify-center">
              <Placeholder />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
