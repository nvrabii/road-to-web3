// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@chainlink/contracts/src/v0.8/KeeperCompatible.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

contract HodlPunks is
    ERC721,
    ERC721Enumerable,
    ERC721URIStorage,
    Ownable,
    KeeperCompatibleInterface,
    VRFConsumerBaseV2
{
    using Counters for Counters.Counter;
    using Strings for uint256;

    enum TokenVariant {
        UP,
        DOWN
    }

    Counters.Counter private _tokenIdCounter;

    // VRF
    VRFCoordinatorV2Interface private _coordinator;
    uint256[] private _randomWords;
    uint256 private _requestId;
    uint32 private _callbackGasLimit = 500000;
    uint64 private _subscriptionId;
    bytes32 private _keyhash =
        0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f;

    AggregatorV3Interface private _pricefeed;

    uint256 private _lastTimestamp;
    uint256 private _interval;

    int256 private _currentPrice;
    TokenVariant private _trend;

    string private _ipfsMetadataRoot =
        "QmYdwzyo3PNinTSr8DxEp4iM5PUg4DS6C6xZC23sAAFGhH";
    string private _baseUrl = "https://ipfs.io/ipfs/";

    string private _metadataFilePrefixUp = "up-hodlpunk-";
    string private _metadataFilePrefixDown = "down-hodlpunk-";

    uint256 private _arts_count = 3;

    constructor(
        address pricefeed,
        address vrfCoordinator,
        uint256 interval
    ) ERC721("HodlPunks Token", "HPTK") VRFConsumerBaseV2(vrfCoordinator) {
        _pricefeed = AggregatorV3Interface(pricefeed);
        _coordinator = VRFCoordinatorV2Interface(vrfCoordinator);

        _lastTimestamp = block.timestamp;
        _interval = interval;
        _currentPrice = getLatestPrice();

        _tokenIdCounter.increment();

        _trend = TokenVariant.UP;
    }

    function safeMint(address to) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, _generateTokenUri());
    }

    function checkUpkeep(
        bytes calldata /*checkData*/
    )
        external
        view
        override
        returns (
            bool upkeepNeeded,
            bytes memory /*performData*/
        )
    {
        upkeepNeeded = (block.timestamp - _lastTimestamp) > _interval;
    }

    function performUpkeep(
        bytes calldata /*performData*/
    ) external override {
        if ((block.timestamp - _lastTimestamp) > _interval) {
            _lastTimestamp = block.timestamp;
            int latestPrice = getLatestPrice();

            if (latestPrice == _currentPrice) {
                return;
            }

            _trend = (latestPrice > _currentPrice)
                ? TokenVariant.UP
                : TokenVariant.DOWN;

            updateAllTokensUris();

            requestRandomnessForNFTUris();

            _currentPrice = latestPrice;
        } else {
            return;
        }
    }

    function updateAllTokensUris() internal {
        for (uint256 id = 0; id < _tokenIdCounter.current(); id++) {
            _setTokenURI(id, _generateTokenUri());
        }
    }

    function requestRandomnessForNFTUris() internal {
        require(_subscriptionId != 0, "_subscriptionId is unset");

        _requestId = _coordinator.requestRandomWords(
            _keyhash,
            _subscriptionId,
            3,
            _callbackGasLimit,
            1
        );
    }

    function fulfillRandomWords(uint256, uint256[] memory randomWords)
        internal
        override
    {
        _randomWords = randomWords;
        updateAllTokensUris();
    }

    function _generateTokenUri() internal view returns (string memory) {
        require(
            _randomWords.length >= _tokenIdCounter.current(),
            "Cannot call this function: randomness is uninitialized"
        );

        string memory prefix = _trend == TokenVariant.UP
            ? _metadataFilePrefixUp
            : _metadataFilePrefixDown;
        uint256 idx = _randomWords[0] % _arts_count;

        return
            string(
                abi.encodePacked(
                    _baseUrl,
                    _ipfsMetadataRoot,
                    "/",
                    prefix,
                    idx.toString(),
                    ".json"
                )
            );
    }

    function getLatestPrice() public view returns (int256) {
        (, int price, , , ) = _pricefeed.latestRoundData();
        return price;
    }

    function setPriceFeed(address pricefeed) public onlyOwner {
        _pricefeed = AggregatorV3Interface(pricefeed);
    }

    function setInterval(uint256 interval) public onlyOwner {
        _interval = interval;
    }

    function setIpfsMetadataRoot(string calldata newIpfsRoot) public onlyOwner {
        _ipfsMetadataRoot = newIpfsRoot;
    }

    function setSubscriptionId(uint64 subscriptionId) public onlyOwner {
        _subscriptionId = subscriptionId;
    }

    function setCallbackGasLimit(uint32 callbackGasLimit) public onlyOwner {
        _callbackGasLimit = callbackGasLimit;
    }

    function setVrfCoordinator(address vrfCoordinator) public onlyOwner {
        _coordinator = VRFCoordinatorV2Interface(vrfCoordinator);
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
