// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract BatchTransfer {

    function transferBatch(address[] calldata _to, uint256[] calldata _amounts) public payable {
        require(_to.length == _amounts.length, "Array lengths must match");

        for (uint256 i = 0; i < _to.length; i++) {
            require(_to[i] != address(0), "Invalid recipient address");
            require(_amounts[i] > 0, "Amount must be greater than zero");

            payable(_to[i]).transfer(_amounts[i]);
        }
    }
}
