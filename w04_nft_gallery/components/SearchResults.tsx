import { TokenType } from "../types";
import { TokenCard } from ".";

function SearchResults({ tokens }: { tokens: Array<TokenType> }) {
  return (
    <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4 p-4 bg-gray-100 rounded mb-4">
      {tokens.map((token, index) => (
        <TokenCard key={`token_card_${index}`} {...token} />
      ))}
    </div>
  );
}

export default SearchResults;
