// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract RegularCollection is
    ERC721,
    ERC721Enumerable,
    ERC721URIStorage,
    Ownable
{
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    // The maximum number of minted NFTs in the collection
    uint256 constant MAX_SUPPLY = 10000;

    // The number of NFTs minted by an account
    mapping(address => uint256) private _mintedCountBy;

    // The maximum number of NFTs that can be minted by an account
    uint256 constant MINT_LIMIT = 5;

    constructor() ERC721("Regular Collection", "REC") {}

    function safeMint(address to, string memory uri) public {
        uint256 tokenId = _tokenIdCounter.current();
        require(tokenId <= 10000, "Max number of minted NFTs has been reached");
        require(
            _mintedCountBy[msg.sender] < MINT_LIMIT,
            "Cannot mint more NFTs from this account"
        );
        _tokenIdCounter.increment();
        _mintedCountBy[msg.sender] += 1;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
