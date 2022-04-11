// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Mods {
    modifier restricted(address manager) {
        require(msg.sender == manager);
        _;
    }
}
