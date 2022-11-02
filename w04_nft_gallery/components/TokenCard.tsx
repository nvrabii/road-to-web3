import { TokenType } from "../types";

function TokenCard({ contract, tokenId, mediaURL }: TokenType) {
  async function copyToClipboard(addr: string) {
    navigator.clipboard.writeText(addr);
  }

  return (
    <div className="bg-gray-200">
      <img src={mediaURL} alt={contract.name} />

      <div className="p-4">
        <div className="mb-4">{contract.name}</div>

        <div className="flex flex-row justify-between items-center mb-4">
          <div className="overflow-hidden text-ellipsis">
            {contract.address}
          </div>
          <button
            className="rounded-full p-2.5 text-center inline-flex items-center hover:bg-white"
            onClick={() => copyToClipboard(contract.address)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 8.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v8.25A2.25 2.25 0 006 16.5h2.25m8.25-8.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-7.5A2.25 2.25 0 018.25 18v-1.5m8.25-8.25h-6a2.25 2.25 0 00-2.25 2.25v6"
              />
            </svg>
          </button>
        </div>

        <div className=" overflow-hidden text-ellipsis">
          {tokenId.toLocaleString("fullwide", { useGrouping: false })}
        </div>
      </div>
    </div>
  );
}

export default TokenCard;
