// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BJJAvatars is ERC721URIStorage, Ownable {
    using Strings for uint256;
    using Counters for Counters.Counter;

    Counters.Counter private _tokenId;

    struct Properties {
        BeltColor beltColor;
        string initials;
    }

    enum BeltColor {
        WHITE,
        BLUE,
        PURPLE,
        BROWN,
        BLACK,
        RED
    }

    mapping(BeltColor => string) private _beltColors;

    mapping(uint256 => Properties) _propertiesOfTokenId;

    constructor() ERC721("BJJ Avatars", "BJJA") {
        // set belt colors
        _beltColors[BeltColor.WHITE] = "white";
        _beltColors[BeltColor.BLUE] = "blue";
        _beltColors[BeltColor.PURPLE] = "purple";
        _beltColors[BeltColor.BROWN] = "brown";
        _beltColors[BeltColor.BLACK] = "black";
        _beltColors[BeltColor.RED] = "red";
    }

    function generateAvatar(uint256 tokenId)
        public
        view
        returns (string memory)
    {
        require(_exists(tokenId), "This avatar doesn't exist");
        Properties memory props = _propertiesOfTokenId[tokenId];

        string memory textColor = props.beltColor == BeltColor.BLACK
            ? "white"
            : "black";

        bytes memory svg = abi.encodePacked(
            '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350">',
            "<style>.base { font-family: sans-serif; font-size: 180px; font-weight: bold; }</style>",
            '<rect fill="',
            _beltColors[props.beltColor],
            '" width="100%" height="100%" rx="40px" />',
            '<text fill="',
            textColor,
            '" x="50%" y="55%" class="base" dominant-baseline="middle" text-anchor="middle">',
            props.initials,
            "</text>",
            "</svg>"
        );

        return
            string(
                abi.encodePacked(
                    "data:image/svg+xml;base64,",
                    Base64.encode(svg)
                )
            );
    }

    function getProperties(uint256 tokenId)
        public
        view
        returns (string memory)
    {
        require(_exists(tokenId), "This avatar doesn't exist");

        Properties memory props = _propertiesOfTokenId[tokenId];

        return
            string(
                abi.encodePacked(
                    '{"initials":"',
                    props.initials,
                    '","beltColor":"',
                    _beltColors[props.beltColor],
                    '"}'
                )
            );
    }

    function getTokenURI(uint256 tokenId) public view returns (string memory) {
        require(_exists(tokenId), "This avatar doesn't exist");

        bytes memory dataURI = abi.encodePacked(
            '{"name":"BJJ Avatars #',
            tokenId.toString(),
            '","description":"Initials avatar synchronized with your BJJ belt color","image":"',
            generateAvatar(tokenId),
            '", "attributes": [{"trait_type": "Belt color", "value": "',
            _beltColors[_propertiesOfTokenId[tokenId].beltColor],
            '"}]}'
        );

        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(dataURI)
                )
            );
    }

    // All new belt owners start with the white belt
    function mint(string memory initials) public {
        uint256 len = bytes(initials).length;
        require(
            len > 0 && len < 3,
            "The initials must contain 1 or 2 characters"
        );

        _tokenId.increment();
        uint256 newTokenId = _tokenId.current();
        _safeMint(msg.sender, newTokenId);
        _propertiesOfTokenId[newTokenId] = Properties(
            BeltColor.WHITE,
            initials
        );
        _setTokenURI(newTokenId, getTokenURI(newTokenId));
    }

    // Promote a belt owner to the next rank
    function promote(uint256 tokenId) public onlyOwner {
        require(_exists(tokenId), "This avatar doesn't exist");
        Properties storage props = _propertiesOfTokenId[tokenId];

        require(props.beltColor < BeltColor.RED, "Cannot promote a red belt");

        props.beltColor = BeltColor(uint(props.beltColor) + 1);

        _setTokenURI(tokenId, getTokenURI(tokenId));
    }
}
