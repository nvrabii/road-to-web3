// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract CoffeeFund is Ownable {
    struct Memo {
        address sender;
        uint256 amount;
        string from;
        string message;
    }

    // Emit on a new coffee donation
    event CoffeeBought(
        address sender,
        uint256 amount,
        string from,
        string message
    );

    // Emit when owner withdraws funds
    event CoffeeFundWithdrawn(uint256 amount);

    Memo[] memos;

    constructor() {}

    function buyCoffee(string memory from, string memory message)
        public
        payable
    {
        require(msg.value > 0, "Transfer amount must be greater than 0");
        memos.push(Memo(msg.sender, msg.value, from, message));
        emit CoffeeBought(msg.sender, msg.value, from, message);
    }

    // Returns the array of memos
    function getMemos() public view returns (Memo[] memory) {
        return memos;
    }

    // Sends collected funds to the owner's address
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "Cannot withdraw from an empty coffee fund");
        require(payable(owner()).send(balance));
        emit CoffeeFundWithdrawn(balance);
    }
}
